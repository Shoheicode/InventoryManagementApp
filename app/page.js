"use client";

import Image from "next/image";
import { Box, Modal, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { query,collection, getDocs, getDoc, doc } from "firebase/firestore";

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
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [item, setItemName] = useState('')

  const updateInventory = async () =>{
    const snapShot = query(collection(firestore, 'pantry'))
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

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
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
    const docRef = doc(collection(firestore, 'pantry'), item)
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

  return <Box 
    width = "100vw"
    height = "100vh"
    display={"flex"}
    justifyContent = {"center"}
    alignItems = {"center"}
    flexDirection={'column'}
    bgcolor={"#8aecff"}
  >
    <Box border={'1px solid #333'}>
      {
        inventory.forEach((item) =>{
          return (
          <>
            {item.name}
            {item.quantity}
          </>
          )
        })
      }
      <Modal open = {open} onClose={handleClose}>
        <Box 
          position='absolute' 
          top='50%' 
          left='50%' 
          textTransform = 'translate(-50%, -50%'
          width={400}
          bgcolor= "blue"
          border = "2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography
            variant="h6"
          >
            Add Item
          </Typography>
          <Stack
            width="100%"
            direction="row"
            spacing={2}
          >
            <TextField>
              
            </TextField>
          </Stack>
        </Box>
      </Modal>
      <Box
        width='800px'
        height='100px'
        bgcolor={'#7c82ff'}
      >
        <Typography variant="h2" color={'#333'} textAlign={'center'}>
          Pantry Items
        </Typography>

      </Box>
      <Stack width = "800px" height = "400px" spacing = {2} overflow={'auto'}>
        {items.map((i)=>(
          <Box 
            key = {i}
            width = "750px"
            height = "200px"
            display = {"flex"}
            justifyContent={'center'}
            alignItems={'center'}
            textAlign={'center'}
            bgcolor={'$f0f0f0'}

          >
            <Typography
              variant = {"h4"}
              color = {'#333'}
              textAlign={'center'}
              fontWeight={'bold'}
            >
              {
                i.charAt(0).toUpperCase() + i.slice(1)
              }
            </Typography>
          </Box>
        ))
        }
      </Stack>
    </Box>

  </Box>;
}
