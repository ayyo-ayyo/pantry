'use client';
import Image from "next/image";
import { Box, Button, Grid, Paper, Stack, InputBase, IconButton, TextField, Modal, Typography} from "@mui/material";
import { LocalSee, Close, FileUpload, Delete, Edit, Search } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, addDoc, doc, getDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Camera } from "react-camera-pro";

const photoSize = 100
export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [id, setId] = useState("");
  const [itemQuantity, setItemQuantity] = useState(0);
  const [itemTags, setItemTags] = useState([]);
  const [addEdit, setAddEdit] = useState("Add");
  const [itemImage, setItemImage] = useState(null);
  const [cameraOpen , setCameraOpen] = useState(false);
  const camera = useRef(null);
  
  const updateInventory = async () => {
    console.log("updating inventory");
    const snapshot = query(collection(firestore, "inventory")); //the database
    const docs = await getDocs(snapshot); //the items in the database
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({name: doc.id, ...doc.data()});
    });
    setInventory(inventoryList);
  }

  //function to make randome alphanumeric strings
  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const addItem = async (item) => {
    let id = makeid(10);
    let docRef = await doc(collection(firestore, "inventory"), id);
    let docSnap = await getDoc(docRef);
    while (docSnap.exists()) {
      //item already exists
      id = makeid(10);
      docRef = await doc(collection(firestore, "inventory"), id);
      docSnap = await getDoc(docRef);
    }
    const snap4All = query(collection(firestore, "inventory"));
    const docs4All = await getDocs(snap4All);
    //check if item is in inventory
    let itemExists = false;
    for (let i = 0; i < docs4All.length; i++) {
      if (docs4All[i].data().name === item) {
        itemExists = true;
        break;
      }
    }
    if (!itemExists) {
      await setDoc(docRef, {
        id: id,
        img: itemImage,
        name: itemName,
        quantity: itemQuantity,
        tags: itemTags
      });
    }
    else {
      alert("item already exists");
    }
    await updateInventory();
    return id;
  }
  const removeItem = async (id) => {
    const docRef = doc(collection(firestore, "inventory"), id); 
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updateInventory();
  }

  const editItem = async (id) => {
    const docRef = doc(collection(firestore, "inventory"), id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(docRef, {
        id: id,
        img: itemImage,
        name: itemName,
        quantity: itemQuantity,
        tags: itemTags
      });
    }
    else {
      alert("item does not exist");
    }
    await updateInventory();
  }



  useEffect(() => {
    updateInventory();
  }, []) //calls function when array passed in is updated

  const handleOpen = (image, name, quantity, tags, AOE = "Add", id) => {
    setId(id);
    setAddEdit(AOE);
    setItemImage(image || null);
    setItemName(name || "");
    setItemQuantity(quantity);
    setItemTags(tags || []);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setItemName("");
    setItemQuantity();
    setItemTags([]);
    setItemImage(null);
    setCameraOpen(false);
  };
  return (
    <Stack width={"100%"} height={"100%"} justifyContent={"center"} alignItems={"center"} spacing={2}>
      
      <SearchBar setItems={setInventory} items={inventory} reset={updateInventory}/>
      <Button onClick={handleOpen}>Add Item</Button>
      <Filters items={inventory} setItems={setInventory} resetFilters={updateInventory}/>
      <Box height="75vh" overflow={"scroll"} >{inventory.map((item) =>{
        
        return (<PantryItem key={item.name} id={item.id} item={item} image={item.img} name={item.name} quantity={item.quantity} tags={item.tags} removeItem={removeItem} handleClose={handleClose} handleOpen={handleOpen} setTags={setItemTags} editItem={editItem} />);
        }) 
      }</Box>
      {/*Add Item Modal*/}
      <ItemMenu id={id} open={open} handleClose={handleClose} addOrEdit={addEdit} setItemImage={setItemImage} itemImage={itemImage} itemName={itemName} setItemName={setItemName} itemQuantity={itemQuantity} setItemQuantity={setItemQuantity} itemTags={itemTags} setItemTags={setItemTags} addItem={addItem} editItem={editItem} />
    
        
    </Stack>
  );
}
export function SearchBar(props) {
  const [text, setText] = useState("");
  return (
    <Paper
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Pantry"
        inputProps={{ 'aria-label': 'search google maps' }}
        onChange={(e) => {
          
          setText(e.target.value);
          
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.setItems(props.items.filter(item => item.name.toLowerCase().includes(text.toLowerCase())));
          }
        }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={async (e) => {
          
          await props.reset();
          props.setItems(props.items.filter(item => item.name.toLowerCase().includes(text.toLowerCase())));
        }}>
        <Search />
      </IconButton>
      
      
    </Paper>
  );
}

export function Filters(props){
  const [tags, setTags] = useState([]);


  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '70vw' }}>
      <Grid container sx={{ width: '70vw'}} spacing={2}>
        
        <Grid item xs={1}>
          Tags
        </Grid>
        <Grid item xs={6}>
          <TextField onKeyDown={(e) => {
            if (e.key === "Enter") {
              //get the text and turn it into a tag
              
              
              setTags(tags.concat(e.target.value));  
              //empty the textfield
              e.target.value = '';
            } 
            
            }}></TextField><Box display={"flex"}>{tags.map(tag => <Tag key = {tag} tag={tag} tags={tags} setTags={setTags} />)}</Box>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={() => {
            props.setItems(props.items.filter(item => tags.every(tag => item.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()))));
          }}
          >Filter</Button>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={() => {
            props.resetFilters();
            setTags([]);
          }}
          >Clear</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

export function Tag(props) {
  return (
    <Box border={1} borderRadius={5} width={'min-content'} padding={1} display={"flex"} alignContent={"center"}>
      <Box height={'min-content'}>{props.tag}</Box>
      {props.x && <IconButton onClick={() => {
        props.setTags(props.tags.filter(tag => tag !== props.tag));
        if (props.itemName !== null && props.itemName !== undefined && props.itemName !== ""){
          console.log(props.itemName);
          console.log("editing item in database")
          props.editItem(props.id).catch((e) => console.log(e));
        }
      }}>
        
        <Close />
      </IconButton>}
    </Box> 
  );
}

export function PantryItem(props) {
  const [open, setOpen] = useState(false);
  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '70vw',  border : 1, borderColor: 'lightgrey', margin: 1}}>
      <Grid container sx={{ width: '70vw'}} spacing={1}>
       <Grid item xs={2}>
       <Image src={props.image} alt={props.name || ""} width={100} height={100} />
       </Grid>
        <Grid item xs={8}>
          <Typography fontSize={36}> {props.name}</Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="edit" onClick={() => {
            //edit in firebase
            
            setOpen(true);
            props.handleOpen(props.item.img, props.item.name, props.item.quantity, props.item.tags, "Edit", props.id);

          }}>
            <Edit />
          </IconButton>
        </Grid>
        <Grid item xs={1}>
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="delete" onClick={() => {
            //delete from firebase
            
            props.removeItem(props.id);
          }}>
            <Delete />
          </IconButton>
          </Grid>
         <Grid item xs={2}></Grid> 
        <Grid item xs={2}><Typography fontSize={24}>Quantity: x{props.quantity}</Typography></Grid>
       
      
      
        <Grid item xs={6}>
          Tags:
          <Box display={'flex'} flexWrap={'wrap'} gap={1}>{props.tags.
          map((tag) => <Tag key={tag} id={props.id} x={false} tag={tag} itemName={props.name} tags={props.tags} setTags={props.setTags} editItem={props.editItem}  />)}</Box>
        </Grid>
        </Grid>
        
    </Paper>
  )
}



export function ItemMenu(props) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const camera = useRef(null);
  
  return (
    <Modal open={props.open} onClose={props.handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        
      {props.addOrEdit === "Add" ? "Add Item" : "Edit Item"}
      {cameraOpen && <Box><Box width={photoSize} height={photoSize}><Camera ref={camera} aspectRatio={1} width={photoSize} height={photoSize} /></Box>
      <button onClick={() => {
        const photo = camera.current.takePhoto();
        props.setItemImage(photo);
        }}>Take photo</button></Box>}
        <Grid container sx={{ width: '70vw'}} spacing={1}>
        <Grid item xs={2}>
          <Box width={photoSize} height={photoSize} border={1}>
            <img src={props.itemImage} width={photoSize} height={photoSize} />
            
            
            </Box><Button sx={{fontSize: 10}} onClick={() => {
              //open filepicker
            setCameraOpen(false);
              const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*'; // only allow images
            input.onchange = (e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (event) => {
                setItemImage(event.target.result);
              };
              reader.readAsDataURL(file);
            };
            input.click();


            }}><FileUpload/> Import Image</Button>
            <Button sx={{fontSize: 10}} onClick={() => {
              //go to camera
              setCameraOpen(true);
            }}><LocalSee/> Take Photo</Button>
        </Grid>
        <Grid item xs={7}>
          <Stack>Name:
          <TextField value={props.itemName} onChange={(e) => props.setItemName(e.target.value)}></TextField>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Button  onClick={async () => {
            if (props.addOrEdit === "Add") {await props.addItem(props.itemName);}
            else {await props.editItem(props.id);}
            props.handleClose();
          }} sx={{border: 1}}>{ props.addOrEdit === "Add" ? "Add" : "Edit"}</Button>
        </Grid>
        <Grid item xs={3}>
          <Stack>Quantity:
          <TextField value={props.itemQuantity} onChange={(e) => props.setItemQuantity(e.target.value)}></TextField>
          </Stack>
          </Grid>
        <Grid item xs={9}>
          <Stack>Tags:
          <TextField onKeyDown={
            (e) => {
              if (e.key === "Enter") {
                //get the text and turn it into a tag
                
                
                props.setItemTags(props.itemTags.concat(e.target.value));
                
                
                //empty the textfield
                e.target.value = '';
              }
            }
          }></TextField>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5}} >
            {props.itemTags ? props.itemTags.map((tag) => <Tag key={tag} x={true} tag={tag} tags={props.itemTags} setTags={props.setItemTags} editItem={props.editItem} />) : null}
          </Box>
          </Stack>
          </Grid>
        </Grid>
        </Box>
      </Modal>
  );
}
