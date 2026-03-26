import React, { useState, useEffect } from "react";
import services from "../services/services.jsx";
import "../styles/UserProfile.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(formData) {
  const errors = {};
  const nombre = formData.nombre.trim();
  const email  = formData.email.trim();
  const pass   = formData.password;

  if (!nombre)             errors.nombre   = "El nombre es obligatorio.";
  else if (nombre.length < 3) errors.nombre = "El nombre debe tener al menos 3 caracteres.";
  else if (nombre.length > 60) errors.nombre = "El nombre no puede exceder 60 caracteres.";

  if (!email)              errors.email    = "El correo es obligatorio.";
  else if (!email.includes("@") || !email.includes("."))
                           errors.email    = 'El correo debe contener "@" y "."';
  else if (!EMAIL_REGEX.test(email)) errors.email = "Formato de correo inválido.";

  if (!pass)               errors.password = "La contraseña es obligatoria.";
  else if (pass.length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres.";
  else if (pass.length > 15) errors.password = "La contraseña no puede exceder 15 caracteres.";

  return errors;
}

function UserProfile({ user, onUpdateUser }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre:   user.nombre   || "",
        email:    user.email    || "",
        password: user.password || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    // Revalidar el campo modificado en tiempo real si ya fue tocado
    if (touched[e.target.name]) {
      const newErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [e.target.name]: newErrors[e.target.name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Marcar todos como tocados y validar
    const allTouched = { nombre: true, email: true, password: true };
    setTouched(allTouched);
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setMensaje({ tipo: "", texto: "" });
    try {
      const updatedUser = { ...user, ...formData };
      await services.putUsuarios(updatedUser, user.id);
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

  const fieldClass = (name) =>
    touched[name] && errors[name] ? "input-error" : "";

  return (
    <div className="user-profile-container">
      <h2>Mi Perfil</h2>
      <p>Aquí puedes ver o editar tu información personal.</p>

      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      <form onSubmit={handleSubmit} className="profile-form" noValidate>
        {/* Nombre */}
        <div className="form-group">
          <label>Nombre: <span className="required-star">*</span></label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("nombre")}
            maxLength={60}
            placeholder="Ej: Juan Pérez"
          />
          {touched.nombre && errors.nombre && (
            <span className="field-error-msg">⚠ {errors.nombre}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Correo Electrónico: <span className="required-star">*</span></label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("email")}
            placeholder="tu@correo.com"
          />
          {touched.email && errors.email && (
            <span className="field-error-msg">⚠ {errors.email}</span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Contraseña: <span className="required-star">*</span></label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldClass("password")}
            placeholder="••••••"
            maxLength={15}
          />
          {touched.password && errors.password && (
            <span className="field-error-msg">⚠ {errors.password}</span>
          )}
          <span className="password-hint">
            Mínimo 6 caracteres, máximo 15.
          </span>
        </div>

        <button type="submit" disabled={loading} className="btn-save">
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
