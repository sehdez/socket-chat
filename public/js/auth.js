
const miFormulario = document.querySelector('form');


const url = ( window.location.hostname.includes('localhost') )
                         ? 'http://localhost:3000/api/auth/'
                         : 'https://rest-server-by-sergio.herokuapp.com/api/auth/'



miFormulario.addEventListener('submit', ev =>{
    ev.preventDefault();
    const formData = {}
    
    for (let elemento of miFormulario.elements){
        if ( elemento.name.length>0 ){
            formData[elemento.name] = elemento.value;
        }
    }
    fetch( url +'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if (msg){
            return console.log(msg)
        }

        localStorage.setItem('token', token)
        window.location = 'chat.html'
    })
    .catch( err => {
        console.log(err)
    } )
})           


function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const body = {id_token: response.credential }
    fetch(url +'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then( resp => resp.json() )
    .then( ({token}) => {
        localStorage.setItem('token', token);
        window.location = 'chat.html'

        
    })
    .catch( console.log );
}
const boton = document.getElementById('signOut');
boton.onclick = () =>{
        
    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke( localStorage.getItem('token'), done => {
        localStorage.clear();
        location.reload();
    } )
}