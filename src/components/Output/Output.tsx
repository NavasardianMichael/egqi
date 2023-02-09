import { combineClassNames } from "helpers/functions/commons";
import { useSelector } from "react-redux";
import { selectCountriesState } from "store/countries/selectors";
import { selectIndices } from "store/indices/selectors";
import { selectYears } from "store/years/selectors";
import styles from './output.module.css'

const Output = () => {

    const countries = useSelector(selectCountriesState)
    const years = useSelector(selectYears)
    const indices = useSelector(selectIndices)

    if(!years || !countries || !indices) return null

    return (
        <div className="mt-4">
            <table className={combineClassNames(['table', styles.output])}>
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Country</th>
                        <th scope="col">EGQGI</th>
                        <th scope="col">EGQEI</th>
                    </tr>
                </thead>
                <tbody>
                    <>
                    {
                        countries.allNames.map(countryName => {
                            console.log(countryName)
                            return (
                                <tr key={countryName}>
                                    <td className={styles.img_cel}>
                                        <img src={`https://flagcdn.com/${countries.byName[countryName].abbr}.svg`} />
                                    </td>
                                    <td>{countryName}</td>
                                    <td>{indices[countryName].means.egqgi}</td>
                                    <td>{indices[countryName].means.egqei}</td>
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
