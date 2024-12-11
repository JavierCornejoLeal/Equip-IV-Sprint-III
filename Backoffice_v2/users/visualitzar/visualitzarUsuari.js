document.addEventListener('DOMContentLoaded', async function() {
    let userToDisplay = JSON.parse(localStorage.getItem("userToDisplay"));
    
    if(userToDisplay){
        let name         = document.getElementById("name");
        let name_content = document.createTextNode(userToDisplay.name);
        name.appendChild(name_content); 

        let email         = document.getElementById("email");
        let email_content = document.createTextNode(userToDisplay.email);
        email.appendChild(email_content);
        
        let pswd         = document.getElementById("pswd");
        let pswd_content = document.createTextNode(userToDisplay.password);
        pswd.appendChild(pswd_content);

        let user_profile    = document.getElementById("user_profile");
        let profile_content = document.createTextNode(userToDisplay.user_profile);
        user_profile.appendChild(profile_content);
    }
})