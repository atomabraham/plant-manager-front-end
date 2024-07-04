import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/PlanDetail.css";

function PlantDetails() {
  const { id } = useParams(); // Récupère l'ID de la plante depuis les paramètres d'URL
  const [plant, setPlant] = useState(null); // État local pour stocker les détails de la plante
  const [arrosage, setArrosage] = useState(null); // État local pour stocker les besoins en eau de la plante
  const [quantity, setQuantity] = useState(""); // État local pour la quantité d'eau à arroser
  const [frequency, setFrequency] = useState(""); // État local pour la fréquence d'arrosage
  const [isEditing, setIsEditing] = useState(false); // État local pour gérer l'édition des besoins en eau
  const [loading, setLoading] = useState(true); // État local pour gérer l'état de chargement
  const [wateringLogs, setWateringLogs] = useState([]); // État local pour stocker les journaux d'arrosage

  // Utilisation de useEffect pour charger les détails de la plante et ses besoins en eau lors du chargement du composant
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/plants/${id}`)
      .then((response) => {
        setPlant(response.data); // Met à jour les détails de la plante dans l'état local
        if (response.data.arrosage) {
          setArrosage(response.data.arrosage); // Met à jour les besoins en eau si disponibles dans l'état local
        }
        setLoading(false); // Chargement terminé
      })
      .catch((error) => {
        console.error("Erreur", error);
        setLoading(false); // Arrête le chargement en cas d'erreur
      });

    // Récupère les journaux d'arrosage pour la plante
    axios
      .get(`http://localhost:8000/api/plants/${id}/waterings`)
      .then((response) => {
        setWateringLogs(response.data); // Met à jour les journaux d'arrosage dans l'état local
      })
      .catch((error) => {
        console.error("There was an error fetching the watering logs!", error);
      });
  }, [id]);

  // Gère la soumission du formulaire pour ajouter les besoins en eau
  const handleArrosageSubmit = (e) => {
    e.preventDefault();

    const watering = {
      quantity,
      frequency,
    };

    axios
      .post(`http://localhost:8000/api/arrosages/${id}`, watering)
      .then((response) => {
        setArrosage(response.data); // Met à jour les besoins en eau dans l'état local avec la réponse de l'API
        setQuantity(""); // Réinitialise la quantité après soumission
        setFrequency(""); // Réinitialise la fréquence après soumission
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
  };

  // Gère la mise à jour des besoins en eau lorsque l'utilisateur édite les champs
  const handleArrosageUpdate = () => {
    const updatedArrosage = {
      quantity,
      frequency,
    };

    axios
      .put(
        `http://localhost:8000/api/arrosages/${id}/${arrosage.id}`,
        updatedArrosage
      )
      .then((response) => {
        setArrosage(response.data); // Met à jour les besoins en eau dans l'état local avec la réponse de l'API
        setIsEditing(false); // Sort du mode d'édition après la mise à jour
        document.location.href = `/plant/${id}`;
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
  };

  // Gère la suppression de la plante
  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/api/plants/${id}`)
      .then((response) => {
        console.log(response.data.message); // Affiche un message de confirmation de suppression dans la console
        document.location.href = "/";
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
  };

  // Gère l'ajout d'un journal d'arrosage
  const handleWatering = () => {
    axios
      .post(`http://localhost:8000/api/plants/${id}/water`)
      .then((response) => {
        setWateringLogs([...wateringLogs, response.data]); // Ajoute le nouveau journal d'arrosage à l'état local
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
  };

  // Affiche un message de chargement si les détails de la plante ne sont pas encore chargés
  if (loading) return <div>Chargement...</div>;

  // Rendu du composant avec les détails de la plante et les besoins en eau
  return (
    <div className="plantDetailDiv">
      <div className="opacityPlantDetailDiv">
        {/* Bouton de retour à la page d'accueil */}
        <Link to="/" className="linkBackToHome">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            className="bi bi-x-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </Link>
        {/* Affichage des détails de la plante */}
        <div className="informationOfPlan">
          <h1>{plant.name}</h1>
          {plant.image && (
            <img
              src={plant.image}
              alt={plant.name}
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          )}
          <p>
            Espèce: <span style={{ color: "#212529" }}>{plant.espece}</span>
          </p>
          <p>
            Date d'achat:{" "}
            <span style={{ color: "#212529" }}>{plant.date_achat}</span>
          </p>

          {/* Affiche les besoins en eau si disponibles */}
          {arrosage ? (
            <div>
              <h2>Arrosage requis</h2>
              <p>
                Quantité:{" "}
                <span style={{ color: "#212529" }}>
                  {arrosage.quantity} Litres tous les {arrosage.frequency} Jours
                </span>
              </p>
              {/* Interface de modification des besoins en eau */}
              {isEditing ? (
                <div>
                  <label>Quantité (Litres):</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                  <label>Fréquence (Jours):</label>
                  <input
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                  />
                  <button onClick={handleArrosageUpdate}>Mettre à jour</button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setQuantity(arrosage.quantity); // Met à jour la quantité d'eau à arroser
                    setFrequency(arrosage.frequency); // Met à jour la fréquence d'arrosage
                  }}
                >
                  Modifier
                </button>
              )}
            </div>
          ) : (
            // Formulaire pour ajouter les besoins en eau s'ils ne sont pas déjà définis
            <div>
              <h3>Ajouter les besoins en eau</h3>
              <form onSubmit={handleArrosageSubmit}>
                <div className="row">
                  <div className="col-md-4">
                    <label>Quantité (Litre):</label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label>Fréquence (Jours):</label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="number"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit">Ajouter l'arrosage</button>
              </form>
            </div>
          )}

          {/* Bouton pour enregistrer un arrosage */}
          <button className="me-2" onClick={handleWatering}>
            Arroser
          </button>

          {/* Bouton de suppression de la plante */}
          <button onClick={handleDelete}>Supprimer la plante</button>

          {/* Liste des journaux d'arrosage */}
          <div>
            <h3>Historique d'arrosage</h3>
            <ul>
              {wateringLogs.map((log) =>
                log.plant_id == `${id}` ? (
                  <li key={log.id}>{log.watered_at}</li>
                ) : (
                  <p>Aucun arrosage pour le moment</p>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantDetails;
