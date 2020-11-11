import React  from 'react'
import style from './hero.module.scss'
import { useSelector } from 'react-redux'
import { globalStoreType } from "../../../constants/types";

const Hero: React.FC = () => {

    const { isLoggedIn } = useSelector((state: globalStoreType) => state.user)

    return (
        <section className={style.section}>
            <div className="container">
                <div className={style.content}>
                    <p className={style.supTitle}>Создай эффективную команду</p>
                    <h1 className={style.title}>
                        <span>T</span><span>E</span><span>A</span><span>M</span> CONSTRUCTOR
                    </h1>
                    <p className={style.subtitle}>
                        анализ команды и кандидатов с точки зрения совместимости психологических профилей
                    </p>
                    <div className={style.buttons}>
                        <a href={isLoggedIn ? 'team' : '/registration'} className={`btn btn-outlined ${style.btn}`}>
                            Начать!
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero