
//---------------------------------VARIABLES-------------------------------------------------------//

    var files = [];
    var reader ;
    var ImgName,ImgURL;

//---------------------------------FIREBASE CONFIGURATION------------------------------------------//

var firebaseConfig = {
    apiKey: "AIzaSyA2xO4XxvzjPOcK_ouT2_aUgcUEZtE8J-Y",
    authDomain: "image-uploader-80cb8.firebaseapp.com",
    projectId: "image-uploader-80cb8",
    storageBucket: "image-uploader-80cb8.appspot.com",
    messagingSenderId: "168277856669",
    appId: "1:168277856669:web:0e6845ad036f1737215f74" 
    
};
                                 // Initialize Firebase
firebase.initializeApp(firebaseConfig);
    
//---------------------------------SELECTION PROCESS-----------------------------------------------//

document.getElementById("select").onclick = e=>{

    var input = document.createElement('input');
    input.type = 'file';
    
    input.onchange = e=>{                //when image is selected
         
         files = e.target.files;         //assigning image from open file dialog to 'files' array
         reader =  new FileReader();
         reader.onload = function(){     
             document.getElementById("myimg").src = reader.result;
         }

         reader.readAsDataURL(files[0]); // read (as URL) the 0th element of the 'files' array which can be assign to the 'myimg' source
    }
    input.click();                       //virtual click 

}

//---------------------------------UPLOAD PROCESS--------------------------------------------------//

document.getElementById('upload').onclick = function(){     //upload image to the storage

    ImgName = document.getElementById('name').value;
    if(ImgName && reader){                                 //image name and image is not null 

        var uploadimg = firebase.storage().ref('Images/'+ImgName+".png").put(files[0]);  

        uploadimg.on('state_changed',function(snapshot){    //This function will calculate the progress of the upload
            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100);
            document.getElementById('progress').innerHTML = 'Upload '+progress+'%';     
        },

        function(error){                                    //error handling
            alert('error in saving the image');
        },

        function(){                                         //submit the link of the image to the database so as to retrieve it later
            uploadimg.snapshot.ref.getDownloadURL().then(function(url){   // retrieve the link/url from firebase storage 
                ImgURL = url;                                                 // restore the image url in ImgURL
            
                firebase.database().ref('Picture/'+ImgName).set({             //save the link/url to the firebase database
                    Name : ImgName,
                    Link : ImgURL
                });

                alert('Image Added Successfully. Now you can Generate URL!');  

            });
        });
    }

    else if(reader){                                          //Only image is selected
        alert("Please,Enter Name!");
        window.location.replace("index.html");
    }

    else{
        alert("Image not selected!");
        window.location.replace("index.html");
    }
}

//----------------------------------------URL RETRIEVAL PROCESS----------------------------//

document.getElementById('retrieve').onclick = function(){
     
    ImgName = document.getElementById('name').value;                          //fetch image name from the input box 
    
    firebase.database().ref('Picture/'+ImgName).once('value').then(function(snapshot){ 

          console.log(snapshot.val().Link);
          document.getElementById('getID').innerHTML = snapshot.val().Link;         // change image source to link
    
    }).catch((e)=>{

            alert("No URL.Please 'UPLOAD' the image name first!");
            window.location.replace("index.html");
    });

}

 //----------------------------------------COPY URL------------------------------------//

function after() {

    var copyText = document.getElementById("getID").innerText;

    if(copyText){              //checks if URL is generated or not 

        var fullLink = document.createElement('input');
        document.body.appendChild(fullLink);
        fullLink.value = copyText;
        fullLink.select();
        fullLink.setSelectionRange(0, 99999);
        document.execCommand("copy",false);
        fullLink.remove();
        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copied!";
        document.getElementById("name").value = "";
        document.getElementById("myimg").style.display = 'none';

    }
    else{
            alert("Image not uploaded or URL not generated");
    }
    window.location.replace("index.html");
}