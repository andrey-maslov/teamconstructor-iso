import React from 'react';
import {useDispatch} from 'react-redux';
import style from './profile-generator.module.scss';
import {setRowData} from "../../../../../actions/actionCreator";

interface ProfileGeneratorProps {
    label: string
    id: string
    getRowData: any
}

const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({label, id, getRowData}) => {

    const dispatch = useDispatch()

    const list = [1, 2, 3, 4, 5];
    const labels = ['Экстраверсия - интроверсия', 'Тревожность - агрессивность', 'Сензитивность - спонтанность', 'Привязанность - отдельность', 'Эмотивность - ригидность']

    const generate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const arr: number[][] = [[],[],[],[],[]];

        for (let i = 1; i < 6; i++) {

            for (let k = 1; k < 6; k++) {
                // console.log(e.target[`field${i}_${k}`].value)

                arr[i - 1].push(Math.round(e.target[`field${i}_${k}`].value))
            }
        }

        const encResult = btoa(JSON.stringify([[1,1,1], arr]))

        if (id === 'profile_1') {
            dispatch(setRowData(encResult, ''))
            getRowData(encResult)
            return
        }
        dispatch(setRowData('', encResult))
        getRowData(encResult)
        return
    }


    return (
        <div className={style.wrapper}>
            <div className={style.title}>{label}</div>
            <form className={style.form} onSubmit={generate}>
                <div className={style.list}>
                    {list.map(num => (
                        <div className={style.group} key={num}>
                            <small>{labels[num - 1]}</small>
                            {list.map(k => <input type="number" name={`field${num}_${k}`} defaultValue={0} key={`${num}${k}`} onFocus={(e: any) => e.target.select()}/>)}
                        </div>
                    ))}
                </div>
                <button className={style.subm} type="submit">Сгенерировать</button>
            </form>
        </div>
    );
}

export default ProfileGenerator;