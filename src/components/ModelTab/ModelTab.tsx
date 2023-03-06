type Props = {}

function ModelTab({}: Props) {
  return (
    <div>
      <table className='table' style={{fontSize: 14}}>
          <thead>
              <tr>
                  <th scope="col">Indicator Name</th>
                  {/* {
                      years.map(year => {
                        <th key={year} className='text-center' scope="col">{year}</th>
                          return (
                          )
                      })
                  } */}
              </tr>
          </thead>
          <tbody>
              <>
                  {/* {
                      indicators.allNames.map(indicatorName => {
                          const { affect } = indicators.byName[indicatorName]
                          const averageForIndicator = ((years.reduce((value, year) => {
                              return value + indices?.[countryName]?.byIndicator[indicatorName][year].normalized
                          }, 0))
                          / years.length)
                          return (
                              <tr key={indicatorName}>
                                  <td>{indicatorName}</td>
                                  {
                                      years.map(year => {
                                          
                                          const value = indices?.[countryName]?.byIndicator[indicatorName][year].normalized
                                          const color = generateColorByValue(+value, affect)
                                          return (
                                              <td 
                                                  className='text-center' 
                                                  key={indicatorName+year} 
                                                  style={{backgroundColor: color}}
                                              >
                                                  {value?.toFixed(2)}
                                              </td>
                                          )
                                      })
                                  }
                                  <td className='text-center' style={{backgroundColor: generateColorByValue(+averageForIndicator, affect)}}>
                                      {
                                          averageForIndicator
                                          ?.toFixed(2)
                                      }
                                  </td>                                            
                              </tr>                                    
                          )
                      })
                  } */}
              </>
          </tbody>
      </table>
    </div>
  )
}

export default ModelTab