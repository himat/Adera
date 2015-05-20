var userListData = [];

$(document).ready(function(){
    populateTable();
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    
    $('#btnAddUser').on('click', addNewUser);
    
    //Delete user link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});


//Fill table with data
function populateTable(){
    var tableContent = '';
    
    //jQuery AJAX call 
    $.getJSON('/users/userlist', function(data) {
        //adds data array to a global object
        userListData = data;
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>'+this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        //Insert the content string into the html
        $('#userList table tbody').html(tableContent);
        
        $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    });
}

function showUserInfo(event) {
    //Prevent link from firing
    event.preventDefault();
    
    var thisUserName = $(this).attr('rel');
    var userNamesArray = userListData.map(function(arrayItem) {
        return arrayItem.username;
    });
    
    var arrayPosition = userNamesArray.indexOf(thisUserName);
    
    var thisUserObject = userListData[arrayPosition];
    
    //Populate info box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
    
};

function addNewUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/newuser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

function deleteUser(event) {
    event.preventDefault();
    
    //Confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');
    
    if(confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function(response) {
            //Success if it returns a blank
            if(response.msg === ''){   }
            else
                alert('error: ' + response.msg);
            
            populateTable();
        });;
    }
    else
        return false;
};