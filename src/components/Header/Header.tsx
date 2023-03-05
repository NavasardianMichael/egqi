import logo from 'assets/images/logo.png'

type Props = {}

function Header({}: Props) {
  return (
    <div className='text-center d-flex align-items-center p-3' style={{gap: 20, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 5px'}} data-testid='header'>
      <img style={{maxWidth: 60}} src={logo} />
      <h4>Digitizing the Economic Growth Quality Index</h4>
    </div>
  )
}

export default Header