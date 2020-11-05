import React from 'react';
import style from './compare-loader.module.scss';

type CompareLoaderProps = {
    type?: string
}

const CompareLoader: React.FC<CompareLoaderProps> = ({type}) => {


    return (
        <div className={`${style.wrapper} ${type === 'full-page' ? style.fp : ''}`}>
            <div className={style.loader}>
                <span className={style.block}/>
                <span className={style.block}/>
                <span className={style.block}/>
                <span className={style.block}/>
                <span className={style.block}/>
                <span className={style.block}/>
                <span className={style.block}/>
                <span className={style.block}/>
                <span className={style.block}/>
            </div>
        </div>
    )

};

export default CompareLoader;