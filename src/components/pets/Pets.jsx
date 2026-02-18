import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaEdit, FaTrashAlt, FaPlus, FaSpinner, FaSearch } from "react-icons/fa";

import { listPets, createPet, updatePet, listSpecies, deletePet as deletePetService } from "../../services/pets";
import { getCurrentUser } from "../../utils/auth";

const Pets = () => {
  const { t } = useTranslation();
  const [Mascotas, setMascotas] = useState([]);
  const [authToken] = useState(localStorage.getItem("token"));
  
  // Estados para el formulario
  const [petNombre, setPetNombre] = useState("");
  const [petEspecieId, setPetEspecieId] = useState("");
  const [petRaza, setPetRaza] = useState("");
  const [petColor, setPetColor] = useState("");
  const [petF_Nacimiento, setPetF_Nacimiento] = useState(""); 

  const [speciesList, setSpeciesList] = useState([]);

  const [isFormLoading, setIsFormLoading] = useState(false); // Para el formulario de agregar/editar
  const [isListLoading, setIsListLoading] = useState(true); // Para la lista inicial
  const [modoEdicion, setModoEdicion] = useState(false);
  const [petIdEnEdicion, setPetIdEnEdicion] = useState(null);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  const mascotasFiltradas = Mascotas.filter((pet) => {
    if (!busqueda.trim()) return true;
    const term = busqueda.toLowerCase().trim();
    const nombre = (pet.name ?? pet.nombre ?? "").toLowerCase();
    const especie = (pet.speciesName ?? pet.species ?? pet.especie ?? "").toLowerCase();
    const raza = (pet.breed ?? pet.raza ?? "").toLowerCase();
    return nombre.includes(term) || especie.includes(term) || raza.includes(term);
  });

  // --- LÓGICA DE CARGA INICIAL Y AUTENTICACIÓN ---
  useEffect(() => {
    // La verificación de token está centralizada en App.jsx,
    // pero mantenemos esta lógica de redirección como respaldo
    if (!authToken) {
      navigate("/auth");
      return;
    }

    listAllPets();
    fetchAllSpecies();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- listAllPets y fetchAllSpecies son estables en montaje
  }, [navigate, authToken]); 

  const listAllPets = async () => {
    setIsListLoading(true);
    try {
      const currentUser = getCurrentUser();
      const creatorId = currentUser?.id ?? currentUser?.userId ?? null;
      const res = await listPets(creatorId);
      if (res && Array.isArray(res)) {
        setMascotas(res);
      } else {
        setMascotas([]);
      }
    } catch (err) {
      console.error("Error al listar mascotas:", err);
    } finally {
      setIsListLoading(false);
    }
  };

  // --- Cargar datos en el formulario para editar ---
  const editPet = (pet) => {
    const id = pet.id ?? pet._id;
    setPetNombre(pet.name ?? pet.nombre ?? "");
    const speciesId = pet.speciesId ?? pet.species_id ?? pet.species?.id ?? pet.species?._id;
    const speciesIdFromName =
      speciesId ||
      (() => {
        const name = pet.species ?? pet.especie;
        if (!name || !speciesList.length) return "";
        const found = speciesList.find(
          (s) => (s.name ?? s.nombre) === name
        );
        return found ? found.id ?? found._id : "";
      })();
    setPetEspecieId(speciesIdFromName ?? "");
    setPetRaza(pet.breed ?? pet.raza ?? "");
    setPetColor(pet.color ?? "");
    setPetF_Nacimiento(pet.birthDate ?? pet.f_nacimiento ?? "");
    setPetIdEnEdicion(id);
    setModoEdicion(true);
    setError(null);
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setPetIdEnEdicion(null);
    setPetNombre("");
    setPetEspecieId("");
    setPetRaza("");
    setPetColor("");
    setPetF_Nacimiento("");
    setError(null);
  };

  // --- AGREGAR O EDITAR MASCOTA ---
  const addPet = async (e) => {
    e.preventDefault();
    setIsFormLoading(true);
    setError(null);

    if (!petNombre?.trim() || !petEspecieId || !petRaza?.trim()) {
      setError(t("pets.nameRequired"));
      setIsFormLoading(false);
      return;
    }

    const speciesName = speciesList.find(
      (s) => String(s.id ?? s._id) === String(petEspecieId)
    )?.name ?? speciesList.find((s) => String(s.id ?? s._id) === String(petEspecieId))?.nombre;

    try {
      if (modoEdicion && petIdEnEdicion) {
        await updatePet(
          authToken,
          petNombre,
          petEspecieId,
          petRaza,
          petColor,
          petF_Nacimiento,
          petIdEnEdicion
        );
        setMascotas((prev) =>
          prev.map((p) => {
            const pid = p.id ?? p._id;
            if (pid === petIdEnEdicion) {
              return {
                ...p,
                name: petNombre,
                nombre: petNombre,
                speciesId: petEspecieId,
                species: speciesName ?? p.species,
                breed: petRaza,
                raza: petRaza,
                color: petColor,
                birthDate: petF_Nacimiento,
                f_nacimiento: petF_Nacimiento,
              };
            }
            return p;
          })
        );
        cancelarEdicion();
      } else {
        const res = await createPet(
          authToken,
          petNombre,
          petEspecieId,
          petRaza,
          petColor,
          petF_Nacimiento
        );
        if (res?.data) {
          const newPet = { ...res.data, id: res.data.id ?? res.data._id };
          setMascotas((prev) => [...prev, newPet]);
          cancelarEdicion();
          const newId = newPet.id ?? res.data?.id ?? res.data?._id;
          if (newId != null) navigate(`/pet/${newId}`);
        } else {
          setError(t("pets.createIncomplete"));
        }
      }
    } catch (err) {
      console.error(modoEdicion ? "Error al actualizar mascota:" : "Error al crear mascota:", err);
      setError(
        modoEdicion
          ? t("pets.saveError")
          : t("pets.createError")
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeletePet = async (pet) => {
    const id = pet?.id ?? pet?._id;
    if (!id) return;
    const petName = pet.name ?? pet.nombre ?? "";
    if (!window.confirm(t("pets.deleteConfirm", { name: petName || "—" }))) return;
    try {
      await deletePetService(authToken, id);
      setMascotas((prev) => prev.filter((p) => (p.id ?? p._id) !== id));
      if (petIdEnEdicion === id) cancelarEdicion();
    } catch (err) {
      console.error("Error al eliminar mascota:", err);
      setError(err?.response?.data?.message || err?.message || t("pets.deleteError"));
    }
  };

  const fetchAllSpecies = async () => {
      try {
          // Asumiendo que listSpecies devuelve un array de objetos o strings de especies
          const res = await listSpecies(authToken); 
          const fetchedSpecies = res?.data ?? res ?? [];
          setSpeciesList(Array.isArray(fetchedSpecies) ? fetchedSpecies : []);

      } catch (err) {
          setSpeciesList([]);
      }
  };

  // --- RENDERIZADO ---
  return (
    <div className="container-fluid pets-page">
      <div className="pets-page-hero">
        <h1>{t("pets.title")}</h1>
        <p className="pets-page-subtitle">{t("pets.subtitle")}</p>
      </div>

      <div className="row">
        {/* COLUMNA IZQUIERDA: LISTA DE MASCOTAS */}
        <div className="col-md-8">
          <div className="pets-page-list-card">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <h2 className="pets-page-list-title">{t("pets.registered")}</h2>
              <div className="input-group pets-page-search">
                <span className="input-group-text">
                  <FaSearch aria-hidden />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("pets.searchPlaceholder")}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label={t("pets.searchAria")}
                />
              </div>
            </div>

            {isListLoading ? (
              <div className="text-center py-5">
                <FaSpinner className="fa-spin text-sisvet-menta" size={24} aria-hidden />
                <p className="mt-2 text-muted">{t("pets.loadingList")}</p>
              </div>
            ) : Mascotas.length === 0 ? (
              <div className="alert alert-info text-center mb-0">
                {t("pets.empty")}
              </div>
            ) : mascotasFiltradas.length === 0 ? (
              <div className="alert alert-warning text-center mb-0">
                {t("pets.noMatch", { search: busqueda })}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle pets-page-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">{t("pets.name")}</th>
                      <th scope="col">{t("pets.species")}</th>
                      <th scope="col">{t("pets.breed")}</th>
                      <th scope="col">{t("pets.owner")}</th>
                      <th scope="col" className="text-center">{t("common.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mascotasFiltradas.map((pet, index) => (
                      <tr key={pet.id ?? pet._id}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          <Link to={`/pet/${pet.id ?? pet._id}`} className="text-decoration-none text-dark fw-semibold">
                            {pet.name ?? pet.nombre}
                          </Link>
                        </td>
                        <td>{pet.speciesName ?? pet.species ?? pet.especie ?? "—"}</td>
                        <td>{pet.breed ?? pet.raza ?? "—"}</td>
                        <td>{pet.owner ? `${pet.owner.firstName ?? ""} ${pet.owner.lastName ?? ""}`.trim() : t("pets.noOwner")}</td>
                        <td className="text-center pets-page-actions">
                          <button
                            type="button"
                            className="btn btn-sisvet-outline-cobalto me-2"
                            onClick={() => editPet(pet)}
                            title={t("pets.editAria")}
                            aria-label={t("pets.editAria")}
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => handleDeletePet(pet)}
                            title={t("pets.deleteAria")}
                            aria-label={t("pets.deleteAria")}
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="col-md-4">
          <div className="pets-page-form-card">
            <h2 className="pets-form-title">
              <FaPlus className="text-sisvet-menta" aria-hidden />
              {modoEdicion ? t("pets.editPet") : t("pets.addPet")}
            </h2>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={addPet}>
              <div className="mb-3">
                <label htmlFor="petNombre" className="pets-form-label">{t("pets.name")}</label>
                <input
                  id="petNombre"
                  type="text"
                  className="form-control pets-form-input"
                  placeholder={t("pets.namePlaceholder")}
                  value={petNombre}
                  onChange={(e) => setPetNombre(e.target.value)}
                  required
                  disabled={isFormLoading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="petEspecie" className="pets-form-label">{t("pets.species")}</label>
                <select
                  id="petEspecie"
                  className="form-select pets-form-input"
                  value={petEspecieId}
                  onChange={(e) => setPetEspecieId(e.target.value)}
                  required
                  disabled={isFormLoading || speciesList.length === 0}
                >
                  <option value="" disabled>{t("pets.selectSpecies")}</option>
                  {speciesList.map((species) => {
                    const sid = species.id ?? species._id;
                    const label = species.name ?? species.nombre ?? sid;
                    return (
                      <option key={sid} value={sid}>
                        {label}
                      </option>
                    );
                  })}
                  {speciesList.length === 0 && (
                    <option value="" disabled>{t("pets.loadingSpecies")}</option>
                  )}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="petRaza" className="pets-form-label">{t("pets.breed")}</label>
                <input
                  id="petRaza"
                  type="text"
                  className="form-control pets-form-input"
                  placeholder={t("pets.breedPlaceholder")}
                  value={petRaza}
                  onChange={(e) => setPetRaza(e.target.value)}
                  required
                  disabled={isFormLoading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="petColor" className="pets-form-label">{t("pets.color")}</label>
                <input
                  id="petColor"
                  type="text"
                  className="form-control pets-form-input"
                  placeholder={t("pets.colorPlaceholder")}
                  value={petColor}
                  onChange={(e) => setPetColor(e.target.value)}
                  disabled={isFormLoading}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="petBirthDate" className="pets-form-label">{t("pets.birthDate")}</label>
                <input
                  id="petBirthDate"
                  type="date"
                  className="form-control pets-form-input"
                  value={petF_Nacimiento}
                  onChange={(e) => setPetF_Nacimiento(e.target.value)}
                  disabled={isFormLoading}
                />
              </div>

              <button
                className="btn btn-sisvet-primary w-100"
                type="submit"
                disabled={isFormLoading}
              >
                {isFormLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    {t("pets.processing")}
                  </>
                ) : (
                  modoEdicion ? t("pets.saveChanges") : t("pets.addPetButton")
                )}
              </button>

              {modoEdicion && (
                <button
                  className="btn btn-sisvet-outline-cobalto w-100 mt-2"
                  type="button"
                  onClick={cancelarEdicion}
                >
                  {t("common.cancel")}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pets;