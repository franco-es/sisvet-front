import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaPlus, FaSpinner } from 'react-icons/fa'; // Importamos iconos

// FUNCIONES DE Pets
import { listPets } from "../../services/pets/listPets";
import { createPet } from "../../services/pets/createPet";
import { listSpecies } from "../../services/pets/listSpecies";
// Asumiendo que tendrás un servicio para eliminar
// import { deletePet as deletePetService } from "../../services/pets/deletePet"; 

const Pets = () => {
  const [Mascotas, setMascotas] = useState([]);
  const [authToken] = useState(localStorage.getItem("token"));
  
  // Estados para el formulario
  const [petNombre, setPetNombre] = useState("");
  const [petEspecie, setPetEspecie] = useState("");
  const [petRaza, setPetRaza] = useState("");
  const [petColor, setPetColor] = useState("");
  const [petF_Nacimiento, setPetF_Nacimiento] = useState(""); 

  const [speciesList, setSpeciesList] = useState([]);
  
  // Estados de control de UX
  const [userAuth, setUserAuth] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false); // Para el formulario de agregar/editar
  const [isListLoading, setIsListLoading] = useState(true); // Para la lista inicial
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

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
    
  }, [navigate, authToken]); 

  const listAllPets = async () => {
    setIsListLoading(true);
    try {
      const res = await listPets(authToken);
      // Aseguramos que 'res.data.pet' sea un array
      if (res && Array.isArray(res)) {
          setMascotas(res);
      } else {
          setMascotas([]);
      }
    } catch (err) {
      console.error("Error al listar mascotas:", err);
      // Manejo de errores de autenticación o servidor
      // navigate("/auth"); // Podrías forzar la salida si falla por token inválido
    } finally {
        setIsListLoading(false);
    }
  };

  // --- LÓGICA DE AGREGAR MASCOTA ---
  const addPet = async (e) => {
    e.preventDefault();
    setIsFormLoading(true);
    setError(null);

    // Validación básica de campos obligatorios
    if (!petNombre || !petEspecie || !petRaza) {
        setError("Nombre, Especie y Raza son obligatorios.");
        setIsFormLoading(false);
        return;
    }

    try {
      const res = await createPet(
        authToken,
        petNombre,
        petEspecie,
        petRaza,
        petColor,
        petF_Nacimiento
      );
      
      // Aseguramos que 'res.data.mascota' exista y sea un objeto
      if (res.data && res.data.mascota) {
        setMascotas([...Mascotas, { ...res.data.mascota }]);
        // Limpiar formulario
        setPetNombre("");
        setPetEspecie("");
        setPetRaza("");
        setPetColor("");
        setPetF_Nacimiento("");
      } else {
         setError("Error al agregar la mascota. Respuesta incompleta.");
      }
      
    } catch (err) {
      console.error("Error al crear mascota:", err);
      setError("Ocurrió un error al intentar agregar la mascota.");
    } finally {
      setIsFormLoading(false);
    }
  };

  // --- LÓGICA DE EDICIÓN Y ELIMINACIÓN (Simulación) ---
  const editPet = (pet) => {
    setModoEdicion(true);
    // Aquí cargarías los datos de 'pet' en el formulario para edición
    console.log("Editando mascota:", pet._id);
  };
  
  const deletePet = (petId) => {
    // Aquí iría la llamada al servicio deletePetService(authToken, petId)
    console.log("Eliminando mascota:", petId);
    // Después de una eliminación exitosa:
    // setMascotas(Mascotas.filter(pet => pet._id !== petId));
  };

  const fetchAllSpecies = async () => {
      try {
          // Asumiendo que listSpecies devuelve un array de objetos o strings de especies
          const res = await listSpecies(authToken); 
          const fetchedSpecies = res || []; 
          setSpeciesList(fetchedSpecies);
          
          fetchedSpecies.forEach(species => {
              console.log("Especie cargada:", species);
          })

      } catch (err) {
          console.error("Error al listar especies:", err);
      }
  };

  // --- RENDERIZADO ---
  const welcomeName = userAuth?.nombre || "Usuario"; // Uso de optional chaining

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold text-dark">
          Bienvenido, {welcomeName}
        </h1>
      </div>

      <div className="row">
        {/* COLUMNA IZQUIERDA: LISTA DE MASCOTAS (8 columnas) */}
        <div className="col-md-8">
          <div className="card shadow-sm p-3 mb-4">
            <h3 className="mb-3 text-primary">Mascotas Registradas</h3>
            <hr className="my-2" />
            
            {isListLoading ? (
                <div className="text-center py-5">
                    <FaSpinner className="fa-spin text-primary" size={24} /> 
                    <p className="mt-2">Cargando lista de mascotas...</p>
                </div>
            ) : Mascotas.length === 0 ? (
                <div className="alert alert-info text-center">
                    Aún no hay mascotas registradas.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                      <thead className="table-light">
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
                        {Mascotas.map((pet, index) => (
                          <tr key={pet.id}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              <Link to={`/pets/${pet.id}`} className="text-decoration-none text-dark fw-semibold">
                                {pet.name}
                              </Link>
                            </td>
                            <td>{pet.species}</td>
                            <td>{pet.breed}</td>
                            <td>{pet.owner ? pet.orner.name : "Sin propietario"}</td>
                            <td className="text-center">
                              {/* Botón de Editar */}
                              <button 
                                className="btn btn-sm btn-outline-primary me-2" 
                                onClick={() => editPet(pet)}
                              >
                                <FaEdit />
                              </button>
                              {/* Botón de Eliminar */}
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => deletePet(pet._id)}
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
            <div className="card shadow-lg p-4">
              <h3 className="text-center text-secondary mb-4 d-flex align-items-center justify-content-center">
                <FaPlus className="me-2 text-primary" />
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
                    value={petEspecie}
                    onChange={(e) => setPetEspecie(e.target.value)}
                    required
                    disabled={isFormLoading || speciesList.length === 0}
                  >
                    <option value="" disabled>Seleccione una Especie</option>
                    {speciesList.map((species) => (
                        // ⚠️ Usar 'species.id' o 'species.nombre' dependiendo de tu estructura de datos
                        <option 
                            key={species.id} 
                            value={species.name}
                        >
                            {species.name}
                        </option>
                    ))}
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
                  className="btn btn-primary w-100" 
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
                        className="btn btn-outline-secondary w-100 mt-2" 
                        type="button" 
                        onClick={() => { setModoEdicion(false); /* Limpiar campos */ }}
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