import logo from 'assets/images/logo.png'

function Header() {
  return (
    <div className='text-center d-flex align-items-center p-3' style={{gap: 20}} data-testid='header'>
      <img style={{maxWidth: 90}} src={logo} alt='EGQI logo' />
      <h5 className='text-secondary mb-0'>Digitizing the Economic Output Quality Index (EOQI or EGQI)</h5>
    </div>
  )
}

export default Header