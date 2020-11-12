import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './use.module.scss'
import { FiExternalLink } from 'react-icons/fi'
import { TEST_URL } from "../../../constants/constants";
import CodeBox from "../../../components/common/Inputs/code-box/CodeBox";

const Use: React.FC = () => {

    const content = [
        {
            title: 'Пройти регистрацию',
            text: 'Создать новый аккаунт или авторизироваться, если аккаунт уже есть. '
        },
        {
            title: 'Пройти экспрес-тест',
            text: 'Найти 10 - 15 минут свободного времени, уединиться и долго не задумываясь ответить на вопросы психологического теста'
        },
        {
            title: 'Выслать ссылку сотрудникам',
            text: 'Сотрудники из которых Вы собираетесь формировать команды должны пройти тест и отдать Вам результаты'
        },
        {
            title: 'Создать проект',
            text: 'Используя сервис teamconstructor создайте свой первый проект'
        },
        {
            title: 'Создать пул работников',
            text: 'Если Ваши работники зарегистрировались в сервисе, то Вы можете легко найти их данные. Если же нет, то Вы можете внести из вручную'
        },
        {
            title: 'Сформировать команды',
            text: 'Путем перетаскивания карточек Ваших сотрудников из пула сформируйте несколько варантов команд и выберите наиболее эффективный'
        },
    ]

    return (
        <section className={style.section}>
            <div className="container">
                <h2 className={`section-title ${style.title}`}>Как пользоваться</h2>

                <div className={style.grid}>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>a.</span>{content[0].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[0].text }} />
                        <NavLink to="/registration" className="btn btn-outlined">Регистрация</NavLink>
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>b.</span>{content[1].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[1].text }} />
                        <a
                            href={TEST_URL}
                            className="btn btn-outlined"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FiExternalLink />
                            Пройти тест
                        </a>
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>c.</span>{content[2].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[2].text }} />
                        <CodeBox
                            content={`${TEST_URL}?lang=ru&open=true`}
                        />
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>d.</span>{content[3].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[3].text }} />
                        <NavLink to="/team" className="btn btn-outlined">Перейти</NavLink>
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>e.</span>{content[4].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[4].text }} />
                    </div>
                    <div className={style.item}>
                        <h3 className={style.itemTitle}><span>f.</span>{content[5].title}</h3>
                        <p dangerouslySetInnerHTML={{ __html: content[5].text }} />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Use