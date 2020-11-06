import React from 'react'
import style from './hero.module.scss'
import { useSelector } from 'react-redux'
import { globalStoreType } from "../../../constants/types";

const Hero: React.FC = () => {

    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)

    return (
        <section className={style.section}>
            <div className="container-wide">
                <div className={style.content}>
                    <h1 className={style.title}>
                        TEAM CONSTRUCTOR <br /><span>Создай эффективную команду</span>
                    </h1>
                    <div className={style.buttons}>
                        <a href={isLoggedIn ? 'team' : '/registration'} className={`btn btn-outlined ${style.btn}`}>
                            Начать!
                        </a>
                    </div>
                    {/*<p className={style.subtitle}>анализ команды и кандидатов  с точки зрения совместимости психологических профилей</p>*/}
                </div>
            </div>
        </section>
    )
}

export default Hero