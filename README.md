# GSSOC'24 Guidelines
- Issues Level
  - Level 1: 10 points  
  - Level 2: 25 points
  - Level 3: 45 points
 
- Issue Assignment
  - Remember assigning an issue to someone does not means that he is the only person to contribute on that particular issue . Other persons can also make PR to that particular issue .

# NextDraw

A Next.js based whiteboard application using Rough.js under the hood . 
- Supports websockets
- Supports shapes like : rectangle || square || ellipse || freehand etc
- Record feature
- Pan | zoom and lot more . Just click on the hosted link.






## Screenshots

![image](https://github.com/dhruvpatidar359/nextdraw/assets/103873587/19f1fa93-8b93-4713-adc5-306605bb8a6f)


## Features

- RECORDING ✅
  
<img width="182" alt="image" src="https://github.com/dhruvpatidar359/nextdraw/assets/103873587/64637de6-60e6-4192-99a5-054864edb6e2">


- Middle Mouse Click ToolBar
- 
 ![image](https://github.com/dhruvpatidar359/nextdraw/assets/103873587/9ba4a9e8-3397-4c89-91da-0932d2012d90)


- Collaboration(Websockets)
  
![image](https://github.com/dhruvpatidar359/nextdraw/assets/103873587/b33557e4-c205-4785-b3f8-4c6f1be50951)



### Built With
* [Next.js]()
* [Canvas API]()
* [MongoDb]()
* [Node.js]()
* [Websockets]()



## Frontend
https://github.com/dhruvpatidar359/nextdraw
## Backend 
https://github.com/dhruvpatidar359/nextDrawBackend





## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

   
## Installation(LOCAL SETUP)

WARNING : First install the backend through this repository 
https://github.com/dhruvpatidar359/nextDrawBackend



**FrontEnd Installation**

1. Fork the Project

```bash
  use the github fork button
```
2. Create a .env.local file in the directory and create the below field: Put the url of the locally  hosted server that we have created before

```bash
 NEXT_PUBLIC_WEB_SOCKET= url of the server
```


3. Install DependenciesNavigate to the project directory in your terminal and run:


```bash
  npm install
  # or
  yarn install
```

4. Start the Development ServerAfter installing dependencies, run:

```bash
 npm run dev
 # or
 yarn dev
 
```



**Remember that this project uses .env for both the backend and frontend part**



## License

Distributed under the MIT License. See `LICENSE` for more information.




## Contact

dhruvpatidar - dhruvpatidar35@gmail.com
