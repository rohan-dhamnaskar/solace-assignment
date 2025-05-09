## List of improvements that I would like to add

1. Pagination
   - for larger datasets, I would like to see pagination going to the API server coming down
2. Table Row Keys
    - I would like to see a unique key for each row in the table, preferable the UUID or primary key from the database
3. Search
    - I would like filters on the search bar that allows me to search for advocates by name, email, phone number, and specialty - this should also make the querying faster
4. Sorting 
    - I would add sorting on the table by name, email, phone number, and specialty
    - I have worked w/ MaterialTable that woudl make this simpler if used w/ MaterialUI
5. Better Error Handling
    - I would like to see better error handling in the API and the client side, adding 404 and 500 error handling pages etc.
6. Accessibility Issues
    - Won't hurt to redo this page from accessibility perspective adding aria-labels and other accessibility features
7. Speed / performance
    - For millions of records, I would probably add a graphQL layer on top for quick searches or break up the search API into a microservice using elasticsearch
    - I would also add a caching layer to the API server to speed up the searches