import logo from 'assets/images/logo.png'

type Props = {}

function Header({}: Props) {
  return (
    <div className='text-center d-flex flex-column'>
      <h3>Digitizing the EGQI</h3>
      <img className='mx-auto' style={{maxWidth: '100px'}} src={logo} />
    </div>
  )
}

export default Header