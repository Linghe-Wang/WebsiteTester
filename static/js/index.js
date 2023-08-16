let serverURL = ""

function clearError(){
    console.log("here")
    var errMessage = document.querySelectorAll('p[style*="color: red; font-size: 14px;"]');
    console.log(errMessage);
    if (errMessage !== null){
        errMessage.forEach((node) => {
            node.parentNode.removeChild(node);;
        });
    }
};

function showError(node, text){
    var textElement = document.createElement("p");
    textElement.innerText = text;
    textElement.style.color = "red";
    textElement.style.fontSize = "14px";
    textElement.style.marginTop = "0px";
    node.parentNode.insertBefore(textElement, node);
}

document.addEventListener('DOMContentLoaded', function () {
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var url = document.getElementById("url");
    var submit = document.getElementById("submit");

    username.addEventListener("click", async function(){
        clearError();
    });

    password.addEventListener("click", async function(){
        clearError();
    });

    url.addEventListener("click", async function(){
        clearError();
    });

    submit.addEventListener("click", async function(){
        clearError();
        submit.textContent = "";
        submit.innerHTML = `<i class="fa fa-spinner fa-spin" id="spinner" style="font-size: 23px;"></i>`
        submit.style.padding = "6px";
        submit.disabled = true;
        var usernameInput = username.value;
        var passwordInput = password.value;
        var urlInput = url.value;
        if (usernameInput == "" || passwordInput == "" || urlInput == ""){
            showError(submit, "All the fields should be filled out, please try again");
        }
        else {
            serverURL = urlInput.replaceAll(' ','');
            var handshake_message = await checkServerUrl();
            if (handshake_message === "You Got it!"){
                match = await postWriterText({state: "adminlogin", username: usernameInput, password: passwordInput});
                if (match == 300){
                    sessionStorage.setItem('serverURL', serverURL);
                    window.location.href = "barGraph.html";
                }
                else if (match == 100){
                    showError(submit, "Incorrect username/password, please try again");
                }
                else if(match == 400){
                    showError(submit, "Sever error encountered, please try again");
                }
            }
            else{
                showError(submit, "Wrong server URL/no internet, please try again");
            }
        }
        submit.removeAttribute("disabled");;
        document.getElementById('spinner').parentNode.removeChild(document.getElementById('spinner'));
        submit.textContent = "Login";
        submit.style.padding = "10px";
    });
});

async function postWriterText(activity) {
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 8000)
        const response = await fetch(serverURL + "/login", {
            // mode: 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(activity),
            signal: controller.signal
        })
        clearTimeout(id);
        const message = await response.json();
        console.log(message);
        // 100: Wrong username/password
        // 200: User already exist
        // 300: pass
        // 400: server error
        return message.status
    }
    catch (err){
        console.log(err);
        console.log('failed to fetch');
        return 400;
    }
}

async function checkServerUrl() {
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 8000)
        const response = await fetch(serverURL + "/handshake", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({message: "Am I accessing the correct server?"}),
            signal: controller.signal
        });
        clearTimeout(id);
        const message = await response.json();
        console.log(message);
        return message.handshake_message;
    }
    catch (err){
        console.log(err);
        console.log('failed to get');
        return "failed to get";
    }
}