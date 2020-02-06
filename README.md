# Backend

The backend for this project uses a database with four tables:

* users
* profiles
* postings
* marks

The users are divided into two types:

1. 'employee' or job-seeker, who can add their *profile* to the database
2. 'employer' or job-poster, who can add a *posting* to the database

Both types of users can *mark* a profile or posting with a +1 or positive swipe, or a -1 or negative swipe.  These marks relate a particular profile to a particular posting and not one user to another.  (For example, an employer might like job-seeker for one job but think they're a bad match for another job that they've posted.)

The database enforces foriegn key consistency but pretty much everything else is left to the front-end to enforce.  So developers are free to reinterpret the meanings of these fields as they see fit.


## Table structure


### users - users and their roles

**column** | **data type**
-----------|--------------
id | integer
username | text
role | text, either ‘employee’ or ‘employer’
password | text (pw will be hashed before being saved)

----

### profiles - user profile for a job seeker (‘employee’)

**column** | **data type**
-----------|--------------
id | integer
user_id | integer - id of user the profile belongs to
name | text, required
phone | text
email | text
description | text - free-form field for user to describe themselves
skills | text
education1 | text
education2 | text
education3 | text
job_history1 | text
job_history2 | text
job_ history3 | text

----

### postings - job posting by an employer

**column** | **data type**
-----------|--------------
id | integer
user_id | integer - id of user the job posting belongs to
job_title | text, required
company | text
phone | text
email | text
company_url | text
job_desc | text - free-form description of job
skills | text - desired skills
level | text - experience level required for position
pay | text - pay range/compensation 

----

### marks - one record for each mark a user makes, pairing a user profile and job posting either positively or negatively

**column** | **data type**
-----------|--------------
id | integer
user_id | integer - user id of user
profile_id | integer - id of profile
posting_id | integer - id of posting
mark | integer - +1 or -1 if user liked/disliked posting or profile

----


## API endpoints


The following endpoints define how the front-end can interact with the back-end.  All endpoints will be relative to a base URL which will be:
https://droom4.herokuapp.com/api


### Open endpoints - can be accessed without first logging in:


* Register as a new user: **POST /auth/register**

    Request body:
    ```
    {
        “username”: text,
        “role”: text,
        “password”: text
    }
    ```

    Role must be one of “employee” or “employer”

    Response body:
    ```
    {
        “id”: integer,
        “username”: text,
        “role”: text,
        “token”: jwt-token
    }
    ```

    Comments: With a successful registration, a token is returned so that the user is immediately logged in and a separate login API call is unnecessary.  These values should be saved in local storage for use by the front end (see more in the comments for login).

    If the username is already in use, the server will respond with a 401 status and:
        ```{ “message”: “username xxx is unavailable” }```
    so that you can inform the user and let them attempt again with a different username.

    If any of username, role, or password are not included in the request body, the server will return a 401 status and an error message.  If the request body is malformed, the server will respond with a 500 status.

----


* Login as an existing user: **POST /auth/login**

    Request body:
    ```
    {
        “username”: text,
        “password”: text
    }
    ```

    Response body:
    ```
    {
        “id”: integer,
        “username”: text,
        “role”: text,
        “token”: jwt-token
    }
    ```

    Comments:  Error handling will be similar to that for the Register endpoint (except that “role” does not need to be specified for Login).

    The returned values from a successful login should be saved on the front end in local storage or other local state.  The value of “role” can be used to determine which app pages the user sees.  The front-end should set the header key-value pair:

        Authorization: jwt-token


    on all subsequent API calls in order to access restricted endpoints.

----


* Get a list of all users: **GET /auth/users**

    Request body: none

    Response body: an array of user objects

----


* Get a list of all job-seeker profiles: **GET /profiles**

    Request body: none

    Response body: an array of all profile objects

----


* Get a single job-seeker profile: **GET /profiles/:id**

    Request body: none

    Response body: a profile object with profile id matching that in the URL.

----


* Get all profiles for a specified user: **GET /profiles/users/:user_id**

    Request body: none

    Response body: an array of profile objects with user_id matching that in the URL.
    
    Note: the array could be empty if there are no profiles for that user or if the user does not exist in the database.

----


* Get a list of all job-postings: **GET /postings**

    Request body: none

    Response body: an array of job-posting objects

----


* Get a single job-posting: **GET /postings/:id**

    Request body: none

    Response body: a job-posting object with posting id matching that in the URL.

----


* Get all postings for a specified user: **GET /postings/users/:user_id**

    Request body: none

    Response body: an array of job-posting objects with user_id matching that in the URL.
    
    Note: the array could be empty if the user has no postings or if the user does not exist in the database.

----


* Get all marks: **GET /marks**

    Request body: none

    Response body: an array of all mark objects

----


* Get a mark by id: **GET /marks/:id**

    Request body: none

    Response body: a mark object which has id = the id in the URL

----


* Get all marks for a single user: **GET /marks/users/:user_id**

    Request body: none

    Response body: an array of mark objects which have user_id = the user_id in the URL

----


### Restricted endpoints - user must be logged in to access:


* Add a user profile: **POST /profiles**

    Request body:  should look like:
    ```
    {
        "name": "Adam Smith",
        "phone": "(202) 555-3434",
        "email": "adam@smith.info",
        "description": "I am a back-end developer looking for a remote position",
        "skills": "Javascript, Node, Knex, SQL, git, jest, PostgreSQL, MySQL",
        "education1": "Lambda School",
        "education2": "Portland Community College",
        "education3": "Clearwater High School",
        "job_history1": "Teller, Citibank",
        "job_history2": "Delivery Driver, UPS",
        "job_history3": "Staff, Burger King"
    }
    ```

    Notes: the only required field is name, all others are optional.  The backend will assign an id value, and will also set the value of user_id based on the id of the user submitting the POST request.

    Response body: the profile object just added, including the id and user_id fields.

----


* Edit a user profile: **PUT /profiles/:id**

    Replaces the contents of the profile with id = :id, with the request body.  See the description at the corresponding POST endpoint for the details. 

----


* Delete a user profile: **DELETE /profiles/:id**

    Removes the profile with id = :id from the profiles table.  Responds with status 204 if successful.

----


* Add a job posting: **POST /postings**

    Request body: should look this this:
    ```
    {
        "job_title": "Full-stack Developer",
        "company": "Unicornz",
        "phone": "(508) 555-8877",
        "email": "ceo@unicornz.com",
        "company_url": "www.unicornz.com",
        "job_desc": "Looking for a hot-shot developer to partner with",
        "skills": "HTML, CSS, Javascript, React, Redux, Node, Express, PostgreSQL",
        "level": "3-5 years experience doing web development",
        "pay": "$120K-$150K plus stock options"
    }
    ```

    Notes: the only required field is job_title, all others are optional.  The backend will assign an id value, and will also set the value of user_id based on the id of the user submitting the POST request.

    Response body: the posting object just added, including the id and user_id fields.

----


* Edit a job posting: **PUT /postings/:id**

    Replaces the posting with id = :id, with the request body.  See the description at the corresponding POST endpoint for the details.

----


* Delete a job posting: **DELETE /postings/:id**

    Removes the posting with id = :id from the postings table.  Responds with status 204 if successful.

----


* Add a mark: **POST /marks**

    Request body:
    ```
    {
        “profile_id”: integer,
        “posting_id”: integer,
        “mark”: integer
    }
    ```

    Notes: the backend will assign an id and will also set “user_id” to the id of the user making the POST request.  The profile_id and posting_id fields are required and must correspond to existing profiles and postings in the database.  The value of “mark” should be -1, 0, or 1, but this is not enforced by the backend.

    Response body: the mark object just created, including the id and user_id fields.

----


* Update a mark: **PUT /marks/:id**

    Replaces the mark with id = :id, with the request body.  See the description at the corresponding POST endpoint for the details.

----


* Delete a mark: **DELETE /marks/:id**

    Removes the mark with id = :id from the marks table.  Responds with status 204 if successful.

