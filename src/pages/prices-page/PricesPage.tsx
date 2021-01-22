import React from 'react'
import { useSelector } from "react-redux";
import { globalStoreType } from "../../constants/types";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Prices from "../landing-page/prices/Prices";

const PricesPage: React.FC = () => {
    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)
    const { t } = useTranslation()

    return (
        <main className="main">
            <div className="container">
                <Prices />
            </div>
        </main>
    )
}

export default PricesPage
