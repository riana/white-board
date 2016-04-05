A simple white board app built with Polymer and packaged with electron :
- create virtual post-its
- store the board locally
- Drag and drop interactions
+ create multiple boards
+ link post-its to each others in a mindmap fashion
+ export to csv

API

http://localhost:32101/api/load?id=simple-board

http://localhost:32101/api/save?id=simple-board

Start local server, store data in *local folder* :
```
   npm test
   http://localhost:32102/
```

Start vulcanized app with electron, store data in *production folder* and serve @32101 :
```
   npm start
```

Create binary package:

```
   gulp pkg
```

# TODO

Create icns icon:

http://stackoverflow.com/questions/12306223/how-to-manually-create-icns-files-using-iconutil

https://www.npmjs.com/package/iconutil
