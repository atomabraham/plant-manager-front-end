import React, { useState } from "react";
import axios from "axios";
import "../Styles/AddPlant.css";
import { Link } from "react-router-dom";

function AddPlant() {
  // conteneur des donneees
  const [name, setName] = useState("");
  const [espece, setEspece] = useState("");
  const [dateAchat, setDateAchat] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  //   recuperaction et traitement de l'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // chargement des donnees de la nouvelle plante
    const formData = new FormData();
    formData.append("name", name);
    formData.append("espece", espece);
    formData.append("date_achat", dateAchat);
    formData.append("image", image);
    console.log(dateAchat);
    axios
      .post("http://localhost:8000/api/plants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        document.location.href = "/";
        console.log("Success", response.data);
      })
      .catch((error) => {
        console.error("erreur!", error);
      });
  };

  return (
    <div className="addPlantDiv">
      <div className="opacityAddPlanDiv">
        <Link to="/" className="linkBackToHome">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            class="bi bi-x-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </Link>
        <div className="row formAddPlant">
          <h1>Ajouter une nouvelle plante</h1>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <label>Nom:</label>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label>Espece:</label>
              </div>
              <div className="col-md-7">
                <input
                  type="text"
                  value={espece}
                  onChange={(e) => setEspece(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label>Date d'achat:</label>
              </div>
              <div className="col-md-7">
                <input
                  type="date"
                  value={dateAchat}
                  onChange={(e) => setDateAchat(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label>Image:</label>
              </div>
              <div className="col-md-7">
                <input type="file" onChange={handleImageChange} />
              </div>
              {preview && (
                <div className="row">
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>
            <button type="submit">Ajouter la plante</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPlant;
