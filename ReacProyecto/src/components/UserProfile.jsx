import React, { useState, useEffect } from "react";
import services from "../services/services.jsx";
import "../styles/UserProfile.css";

function UserProfile({ user, onUpdateUser }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        password: user.password || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });
    try {
      const updatedUser = { ...user, ...formData };
      await services.putUsuarios(updatedUser, user.id);
      
      // Actualizar localStorage y el estado padre
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);
      
      setMensaje({ tipo: "success", texto: "Perfil actualizado correctamente." });
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "Hubo un error al actualizar el perfil." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-container">
      <h2>Mi Perfil</h2>
      <p>Aquí puedes ver o editar tu información personal.</p>
      
      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn-save">
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
