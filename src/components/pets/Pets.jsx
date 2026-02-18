import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaPlus, FaSpinner, FaSearch } from 'react-icons/fa';

import { listPets, createPet, updatePet, listSpecies, deletePet as deletePetService } from "../../services/pets";
import { getCurrentUser } from "../../utils/auth"; 

const Pets = () => {
  const [Mascotas, setMascotas] = useState([]);
  const [authToken] = useState(localStorage.getItem("token"));
  
  // Estados para el formulario
  const [petNombre, setPetNombre] = useState("");
  const [petEspecieId, setPetEspecieId] = useState("");
  const [petRaza, setPetRaza] = useState("");
  const [petColor, setPetColor] = useState("");
  const [petF_Nacimiento, setPetF_Nacimiento] = useState(""); 

  const [speciesList, setSpeciesList] = useState([]);
  
  // Estados de control de UX
  const [userAuth, setUserAuth] = useState(null);
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

    const user = localStorage.getItem("user");
    if (user) {
        setUserAuth(JSON.parse(user));
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
      setError("Nombre, Especie y Raza son obligatorios.");
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
          setError("Error al agregar la mascota. Respuesta incompleta.");
        }
      }
    } catch (err) {
      console.error(modoEdicion ? "Error al actualizar mascota:" : "Error al crear mascota:", err);
      setError(
        modoEdicion
          ? "Ocurrió un error al guardar los cambios."
          : "Ocurrió un error al intentar agregar la mascota."
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeletePet = async (pet) => {
    const id = pet?.id ?? pet?._id;
    if (!id) return;
    if (!window.confirm(`¿Eliminar la mascota "${pet.name ?? pet.nombre ?? "esta mascota"}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deletePetService(authToken, id);
      setMascotas((prev) => prev.filter((p) => (p.id ?? p._id) !== id));
      if (petIdEnEdicion === id) cancelarEdicion();
    } catch (err) {
      console.error("Error al eliminar mascota:", err);
      setError(err?.response?.data?.message || err?.message || "No se pudo eliminar la mascota.");
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
  const welcomeName = userAuth?.nombre || "Usuario"; // Uso de optional chaining
  return (
    <div className="container-fluid mt-4 px-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-sisvet-cobalto">
          Bienvenido, {welcomeName}
        </h1>
      </div>

      <div className="row">
        {/* COLUMNA IZQUIERDA: LISTA DE MASCOTAS (8 columnas) */}
        <div className="col-md-8">
          <div className="card card-sisvet shadow-sm p-3 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <h3 className="mb-0 text-sisvet-cobalto">Mascotas Registradas</h3>
              <div className="input-group" style={{ maxWidth: "280px" }}>
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-sisvet-cobalto" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar por nombre, especie o raza..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar mascotas"
                />
              </div>
            </div>
            <hr className="my-2" style={{ borderColor: 'var(--sisvet-platino-dark)' }} />
            
            {isListLoading ? (
                <div className="text-center py-5">
                    <FaSpinner className="fa-spin text-sisvet-menta" size={24} /> 
                    <p className="mt-2">Cargando lista de mascotas...</p>
                </div>
            ) : Mascotas.length === 0 ? (
                <div className="alert alert-info text-center">
                    Aún no hay mascotas registradas.
                </div>
            ) : mascotasFiltradas.length === 0 ? (
                <div className="alert alert-warning text-center">
                    No hay mascotas que coincidan con &quot;{busqueda}&quot;.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                      <thead className="thead-sisvet">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Nombre</th>
                          <th scope="col">Especie</th>
                          <th scope="col">Raza</th>
                          <th scope="col">Dueño</th>
                          <th scope="col" className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mascotasFiltradas.map((pet, index) => (
                          <tr key={pet.id}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <Link to={`/pet/${pet.id}`} className="text-decoration-none text-dark fw-semibold">
                                {pet.name}
                              </Link>
                            </td>
                            <td>{pet.speciesName}</td>
                            <td>{pet.breed}</td>
                            <td>{pet.owner ? pet.owner.firstName + " " + pet.owner.lastName : "Sin propietario"}</td>
                            <td className="text-center">
                              {/* Botón de Editar */}
                              <button 
                                className="btn btn-sm btn-sisvet-outline-cobalto me-2" 
                                onClick={() => editPet(pet)}
                              >
                                <FaEdit />
                              </button>
                              {/* Botón de Eliminar */}
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => handleDeletePet(pet)}
                                title="Eliminar mascota"
                                aria-label="Eliminar mascota"
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

        {/* COLUMNA DERECHA: FORMULARIO (4 columnas) */}
        <div className="col-md-4">
            {/* Estilo de Tarjeta para el formulario */}
            <div className="card card-sisvet shadow-sm p-4">
              <h3 className="text-center text-sisvet-cobalto mb-4 d-flex align-items-center justify-content-center">
                <FaPlus className="me-2 text-sisvet-menta" />
                {modoEdicion ? "Editar Mascota" : "Agregar Mascota"}
              </h3>
              
              {error && <div className="alert alert-danger text-center">{error}</div>}

              <form onSubmit={addPet}>
                
                {/* Nombre */}
                <div className="form-group mb-3">
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="form-control"
                    value={petNombre}
                    onChange={(e) => setPetNombre(e.target.value)}
                    required
                    disabled={isFormLoading}
                  />
                </div>
                
                {/* Especie */}
                <div className="form-group mb-3">
                  <select
                    className="form-select"
                    value={petEspecieId}
                    onChange={(e) => setPetEspecieId(e.target.value)}
                    required
                    disabled={isFormLoading || speciesList.length === 0}
                  >
                    <option value="" disabled>Seleccione una Especie</option>
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
                        <option value="" disabled>Cargando especies...</option>
                    )}
                  </select>
                </div>
                
                {/* Raza */}
                <div className="form-group mb-3">
                  <input
                    type="text"
                    placeholder="Raza"
                    className="form-control"
                    value={petRaza}
                    onChange={(e) => setPetRaza(e.target.value)}
                    required
                    disabled={isFormLoading}
                  />
                </div>
                
                {/* Color */}
                <div className="form-group mb-3">
                  <input
                    type="text"
                    placeholder="Color"
                    className="form-control"
                    value={petColor}
                    onChange={(e) => setPetColor(e.target.value)}
                    disabled={isFormLoading}
                  />
                </div>
                
                {/* Fecha de Nacimiento */}
                <div className="form-group mb-4">
                    <label htmlFor="petBirthDate" className="form-label visually-hidden">Fecha de Nacimiento</label>
                  <input
                    id="petBirthDate"
                    type="date"
                    placeholder="Fecha de Nacimiento"
                    className="form-control"
                    value={petF_Nacimiento}
                    onChange={(e) => setPetF_Nacimiento(e.target.value)}
                    disabled={isFormLoading}
                  />
                </div>
                
                {/* Botón de Submit */}
                <button 
                  className="btn btn-sisvet-primary w-100" 
                  type="submit"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Procesando...
                      </>
                  ) : (
                      modoEdicion ? "Guardar Edición" : "Agregar Mascota"
                  )}
                </button>
                
                {/* Botón de Cancelar Edición */}
                {modoEdicion && (
                    <button 
                        className="btn btn-sisvet-outline-cobalto w-100 mt-2" 
                        type="button" 
                        onClick={cancelarEdicion}
                    >
                        Cancelar
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