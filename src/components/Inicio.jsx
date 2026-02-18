import React from "react";
import { useTranslation } from "react-i18next";

const Inicio = () => {
  const { t } = useTranslation();
  return (
    <div className="bgPet">
      <div className="mt-5 center">
        <h1 className="justify-content-center text-sisvet-cobalto fw-bold">{t("home.welcome")}</h1>
      </div>
    </div>
  );
};

export default Inicio;
