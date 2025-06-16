import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function Card({ children, className }) {
  return (
    <div
      className={
        "bg-white rounded-lg shadow p-6 border border-pink-300 " + (className || "")
      }
    >
      {children}
    </div>
  );
}

function Badge({ children, variant = "default", className }) {
  const baseClasses =
    "inline-block px-2 py-1 rounded-full text-xs font-semibold ";

  let variantClasses = "bg-pink-100 text-pink-700";
  if (variant === "secondary")
    variantClasses = "bg-pink-200 text-pink-900";
  if (variant === "destructive")
    variantClasses = "bg-red-100 text-red-700";

  return (
    <span className={baseClasses + variantClasses + " " + (className || "")}>
      {children}
    </span>
  );
}

function Skeleton({ className }) {
  return (
    <div
      className={"bg-pink-200 animate-pulse rounded " + (className || "")}
    />
  );
}

export default function Menu() {
  const { data: plats, isLoading, error } = useQuery({
    queryKey: ["/api/plats"],
    queryFn: async () => {
      // Exemple de données mockées, à remplacer par API réelle
      await new Promise((r) => setTimeout(r, 800));
      return [
        {
          id: 1,
          nom: "Salade Belle Vue",
          description: "Salade fraîche avec tomates, concombres et olives.",
          prix: 8.5,
          categorie: "entrée",
          disponible: true,
          imageUrl: "",
        },
        {
          id: 2,
          nom: "Poulet rôti aux herbes",
          description: "Poulet fermier rôti, accompagné de légumes de saison.",
          prix: 15.0,
          categorie: "plat principal",
          disponible: true,
          imageUrl: "",
        },
        {
          id: 3,
          nom: "Tarte aux fraises",
          description: "Tarte maison aux fraises fraîches.",
          prix: 6.0,
          categorie: "dessert",
          disponible: false,
          imageUrl: "",
        },
        {
          id: 4,
          nom: "Jus d'orange frais",
          description: "Jus pressé minute.",
          prix: 3.5,
          categorie: "boisson",
          disponible: true,
          imageUrl: "",
        },
      ];
    },
  });

  const categories = ["entrée", "plat principal", "dessert", "boisson"];

  const getPlatsParCategorie = (categorie) => {
    return plats?.filter(
      (plat) => plat.categorie === categorie && plat.disponible
    ) || [];
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erreur</h2>
          <p className="text-gray-600">Impossible de charger le menu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* En-tête */}
      <section className="bg-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notre Menu</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Découvrez notre sélection de plats préparés avec des ingrédients
            frais et de qualité par notre équipe de chefs passionnés.
          </p>
        </div>
      </section>

      {/* Menu par catégories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((categorie) => {
            const platsCategorie = getPlatsParCategorie(categorie);

            if (platsCategorie.length === 0 && !isLoading) return null;

            return (
              <div key={categorie} className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center capitalize">
                  {categorie === "plat principal"
                    ? "Plats Principaux"
                    : categorie === "entrée"
                    ? "Entrées"
                    : categorie === "dessert"
                    ? "Desserts"
                    : "Boissons"}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading
                    ? // Squelettes de chargement
                      Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="card-belle-vue">
                          <div className="p-6">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-full mb-4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </Card>
                      ))
                    : platsCategorie.map((plat) => (
                        <Card
                          key={plat.id}
                          className="hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold">{plat.nom}</h3>
                            <Badge variant="secondary" className="ml-2">
                              {parseFloat(plat.prix).toFixed(2)}€
                            </Badge>
                          </div>

                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {plat.description}
                          </p>

                          {plat.imageUrl && (
                            <div className="mt-4 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-sm">
                                Photo du plat
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-4">
                            <span className="text-2xl font-bold text-pink-600">
                              {parseFloat(plat.prix).toFixed(2)}€
                            </span>

                            {plat.disponible ? (
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-800"
                              >
                                Disponible
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Indisponible</Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                </div>
              </div>
            );
          })}

          {!isLoading && plats?.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">Menu en préparation</h3>
              <p className="text-gray-700">
                Notre équipe met à jour le menu. Revenez bientôt pour découvrir
                nos délicieux plats !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Section informative */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Nos Engagements Qualité</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ingrédients Frais</h3>
              <p className="text-gray-700">
                Nous sélectionnons chaque jour les meilleurs produits locaux et de
                saison.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Préparation Minute</h3>
              <p className="text-gray-700">
                Tous nos plats sont préparés à la commande pour garantir fraîcheur
                et saveur.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chef Expérimenté</h3>
              <p className="text-gray-700">
                Notre équipe culinaire allie tradition et innovation pour votre
                plaisir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
