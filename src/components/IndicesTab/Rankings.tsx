import { useCallback, useState } from 'react'
import { combineClassNames } from "helpers/functions/commons";
import { useDispatch, useSelector } from "react-redux";
import { selectCountriesState } from "store/countries/selectors";
import { selectIndices } from "store/indices/selectors";
import { selectYears } from "store/years/selectors";
import styles from './indicesTab.module.css'
import { sortCountries } from 'store/countries/actionCreators';
import { COL_FULL_NAMES, COL_NAMES, COL_SORT_TYPES } from 'helpers/constants.ts/indices';
import { CountryDetails } from 'components/CountryDetails/CountryDetails';
import { T_Country } from 'store/countries/types';

const Rankings = () => {

    const dispatch = useDispatch()
    const countries = useSelector(selectCountriesState)
    const years = useSelector(selectYears)
    const indices = useSelector(selectIndices)
    const [openedCountryName, setOpenedCountryName] = useState<T_Country['name']>('')
    const [sortedStatuses, setSortedStatuses] = useState<{ [key in keyof typeof COL_NAMES]: 0 | 1 | 2 }>({
        [COL_NAMES.country]: 0,
        [COL_NAMES.egqi]: 0,
        [COL_NAMES.egqgi]: 0,
        [COL_NAMES.egqei]: 0,
        [COL_NAMES.egqemr]: 0,
    })

    const handletableHeaderClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
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

    const handleShowDetails: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const { name } = e.currentTarget
        setOpenedCountryName(name) 
    }

    const closeDetails = useCallback(() => {
        setOpenedCountryName('')
    }, [])

    const thClassNames = [styles.disabled, styles.descending, '']

    if(!years?.length || !countries || !indices) return null

    return (
        <div>
            <table className={combineClassNames(['table', 'text-center', 'mt-3', styles.output])}>
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
                                                onClick={handletableHeaderClick}
                                            />
                                            <span title={COL_FULL_NAMES[colName]}>{colName}</span>
                                        </div>
                                    </th>
                                )
                            })
                        }
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <>
                        {
                            countries.allNames.map((countryName, i) => {
                                return (
                                    <tr key={countryName} className={styles.row}>
                                        <td>{i+1}</td>
                                        <td className={styles.img_cell}>
                                            <img src={`https://flagcdn.com/${countries.byName[countryName].abbr}.svg`} />
                                        </td>
                                        <td>{countryName}</td>
                                        <td>{indices[countryName].means.egqgi.toFixed(2)}</td>
                                        <td>{indices[countryName].means.egqei.toFixed(2)}</td>
                                        <td>{indices[countryName].means.egqi.toFixed(2)}</td>
                                        <td>{indices[countryName].means.egqemr.toFixed(2)}</td>
                                        <td className={styles.actions}>
                                            <button 
                                                title={`${countryName} Details`}
                                                name={countryName}
                                                onClick={handleShowDetails} 
                                            >
                                                <i className="bi bi-info-circle"></i>
                                            </button>
                                        </td>
                                    </tr> 
                                )
                            })
                        }   
                    </>
                </tbody>
            </table>
            <CountryDetails 
                countryName={openedCountryName} 
                close={closeDetails} 
            />  
        </div>
    );
}

export default Rankings;
