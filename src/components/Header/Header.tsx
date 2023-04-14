import logo from 'assets/images/logo.png'

type Props = {}

function Header({}: Props) {
  return (
    <div className='text-center d-flex align-items-center p-3' style={{gap: 20}} data-testid='header'>
      <img style={{maxWidth: 90}} src={logo} />
      <h5 className='text-secondary mb-0'>Digitizing the Economic Growth Quality Index</h5>
    </div>
  )
}

export default Header