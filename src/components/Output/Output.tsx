import { useState } from 'react'
import { combineClassNames } from "helpers/functions/commons";
import { useDispatch, useSelector } from "react-redux";
import { selectCountriesState } from "store/countries/selectors";
import { selectIndices } from "store/indices/selectors";
import { selectYears } from "store/years/selectors";
import styles from './output.module.css'
import { sortCountries } from 'store/countries/actionCreators';
import { COL_NAMES, COL_SORT_TYPES } from 'helpers/constants.ts/indices';

const Output = () => {

    const dispatch = useDispatch()
    const countries = useSelector(selectCountriesState)
    const years = useSelector(selectYears)
    const indices = useSelector(selectIndices)
    const [sortedStatuses, setSortedStatuses] = useState<{ [key in keyof typeof COL_NAMES]: 0 | 1 | 2 }>({
        [COL_NAMES.country]: 0,
        [COL_NAMES.egqi]: 0,
        [COL_NAMES.egqgi]: 0,
        [COL_NAMES.egqei]: 0,
        [COL_NAMES.egqemr]: 0,
    })

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const name = e.currentTarget.name as keyof typeof COL_NAMES
        setSortedStatuses(prev => {
            return {
                ...prev,
                [name]: 3 - (prev[name] || 2)
            }
        })
        dispatch(sortCountries({
            col: name,
            indices,
            order: 3 - (sortedStatuses[name] || 2) as keyof typeof COL_SORT_TYPES
        }))
    }

    const thClassNames = [styles.disabled, styles.descending, '']

    if(!years?.length || !countries || !indices) return null

    return (
        <div className="mt-4">
            <table className={combineClassNames(['table', 'text-center', styles.output])}>
                <thead>
                    <tr>
                        <th scope="col">Rank</th>
                        <th scope="col"></th>
                        {
                            Object.values(COL_NAMES).map(colName => {
                                return (
                                    <th key={colName} scope="col">
                                        <div className={styles.sortable_cell}>                                
                                            <button 
                                                className={thClassNames[sortedStatuses[colName]]} 
                                                name={colName}
                                                onClick={handleClick}
                                            />
                                            <span>{colName}</span>
                                        </div>
                                    </th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    <>
                    {
                        countries.allNames.map((countryName, i) => {
                            return (
                                <tr key={countryName}>
                                    <td>{i+1}</td>
                                    <td className={styles.img_cell}>
                                        <img src={`https://flagcdn.com/${countries.byName[countryName].abbr}.svg`} />
                                    </td>
                                    <td>{countryName}</td>
                                    <td>{indices[countryName].means.egqgi.toFixed(2)}</td>
                                    <td>{indices[countryName].means.egqei.toFixed(2)}</td>
                                    <td>{indices[countryName].means.egqi.toFixed(2)}</td>
                                    <td>{indices[countryName].means.egqemr.toFixed(2)}</td>
                                </tr> 
                            )
                        })
                    }
                        
                    </>

                </tbody>
            </table>      
        </div>
    );
}

export default Output;
