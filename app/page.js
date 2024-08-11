"use client";

import Image from "next/image";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { firestore } from "@/app/firebase";
import { query,collection, getDocs, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import {Camera} from "react-camera-pro";

const items = [
  'tomato',
  'potato',
  'onion',
  'garlic',
  'ginger',
  'carrot',
  'beans',
  'brocolli',
  'new jeans'
]

export default function Home() {
  const [searching, setSearch] = useState([])
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [sea, setSearchOpen] = useState(false)
  const [searchName, setSearchWord] = useState('')
  const [itemName, setItemName] = useState('')
  const style = {
    transform: 'translate(-50%, -50%)',
  }

  const updateInventory = async () =>{
    const snapShot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapShot)
    const inventoryList = []
    docs.forEach((doc) =>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    })
    setInventory(inventoryList)
  }

  const search = async (item) =>{
    if(item == ""){
      return;
    }

    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    const list = []
    console.log( "ITEM:" + item)

    if(docSnap.exists()){
      console.log("HIHIHIHI")
      const number = docSnap.data()
      list.push(number['quantity'])
    }

    setSearch(list)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity+1})
    }else{
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity === 1){
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {quantity: quantity-1})
      }
    }

    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const searchOpen = () => setSearchOpen(true)
  const searchClose = () => setSearchOpen(false)


  //Camera stuff
  const camera = useRef(null);
  const [image, setImage] = useState(null);

  return <Box 
    width = "100vw"
    height = "auto"
    display={"flex"}
    justifyContent = {"space-around"}
    alignItems = {"center"}
    flexDirection={'column'}
    bgcolor={"#8aecff"}
  >
      <Modal 
        open = {sea} 
        onClose={searchClose}
        
      >
        <Box sx={style}
          position='absolute' 
          top='50%' 
          left='50%' 
          transform = 'translate(-50%, -50%)'
          width={400}
          bgcolor= 'white'
          border = "2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Box>
            <TextField
              variant="outlined"
              fullWidth
              value={searchName}
              onChange={(e) => setSearchWord(e.target.value)}
            >

            </TextField>
            <Button variant = "contained" onClick = {() => search(searchName)}>
              Search
            </Button>
          </Box>
          <Stack height={100}>
            {
              searching.map(
                (amount) => {
                  return <Box
                    key = {amount}
                  >
                    <Typography
                    variant = {"h4"}
                    color = {'black'}
                    textAlign={'center'}
                    fontWeight={'bold'}
                    >
                      Quantity: {amount}
                    </Typography>
                  </Box>
                }
              )
            }
          </Stack>
        </Box>
      </Modal>   
      <Modal 
        open = {open} 
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}
          position='absolute' 
          top='50%' 
          left='50%' 
          transform = 'translate(-50%, -50%)'
          width={400}
          bgcolor= 'white'
          border = "2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography
            variant="h6"
            id="modal-modal-title" 
            component="h2"
          >
            Add Item
          </Typography>
          <Stack
            width="100%"
            direction="row"
            spacing={2}
          >
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth ={true}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            >
              
            </TextField>
            <Button 
              variant="outlined"
              onClick={ () => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }  
              }
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box width = {'100%'} display={"flex"} flexDirection={'row'} justifyContent={'space-around'}>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>

        <Button variant = "contained" onClick = {searchOpen}>
          Search
        </Button>
      </Box>
    <Box border={'1px solid #333'}>
      <Box
        width='800px'
        height='100px'
        bgcolor={'#7c82ff'}
      >
        <Typography variant="h2" color={'#333'} textAlign={'center'}>
          Inventory Items
        </Typography>

      </Box>
      <Stack width = "800px" height = "400px" spacing = {2} overflow={'auto'}>
        {inventory.map(
          ({name, quantity})=>(
          <Box 
            key = {name}
            width = "750px"
            height = "200px"
            display = {"flex"}
            justifyContent={'space-between'}
            alignItems={'center'}
            textAlign={'center'}
            bgcolor={'$f0f0f0'}
            padding={5}
          >
            <Typography
              variant = {"h4"}
              color = {'#333'}
              textAlign={'center'}
              fontWeight={'bold'}
            >
              {
                name.charAt(0).toUpperCase() + name.slice(1)
              }
            </Typography>
            <Typography
              variant = {"h4"}
              color = {'#333'}
              textAlign={'center'}
              fontWeight={'bold'}
            >
              Quantity: {quantity}
            </Typography>
            <Button variant="contained" onClick={() => removeItem(name)}>
              X
            </Button>
          </Box>
        ))
        }
      </Stack>
    </Box>
    <Box 
        width={400} 
        height={300} 
        display={'flex'}
        flexDirection={'row'}
      >
          <Camera ref={camera} aspectRatio={16/9}/>
          <button onClick={() => setImage(camera.current.takePhoto())}>Take photo</button>
          <img src={image} alt='Taken photo'/>
      </Box>
  </Box>;
}
