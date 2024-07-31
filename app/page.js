import Image from "next/image";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, RadioGroup, Stack } from "@mui/material";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Add, Remove, Visibility } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { FormControlLabel, Radio } from "@mui/material";

export default function Home() {
  return (
    <Stack width={"100%"} height={"100%"} justifyContent={"center"} alignItems={"center"}>
      <SearchBar />
      <Filters />
      <PantryItem name="Apple" quantity="1" />
    </Stack>
  );
}
export function SearchBar() {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '70vw' }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Pantry"
        inputProps={{ 'aria-label': 'search pantry' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="plus">
        <Add />
      </IconButton>
    </Paper>
  );
}

export function Filters(){
  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '70vw' }}>
      <Grid container sx={{ width: '70vw'}} spacing={2}>
        <Grid item xs={2}>
          Quantity
        </Grid>
        <Grid item xs={2} md={1}>
          <TextField></TextField>
        </Grid>
        <Grid item xs={8}>
          <RadioGroup row>
            <FormControlLabel value=">" control={<Radio />} label="Greater than" />
            <FormControlLabel value="<" control={<Radio />} label="Less than" />
            <FormControlLabel value="=" control={<Radio />} label="Equal to" />
          </RadioGroup>
        </Grid>
        <Grid item xs={1}>
          Tags
        </Grid>
        <Grid item xs={6}>
          <TextField></TextField>
        </Grid>
      </Grid>
    </Paper>
  )
}

export function PantryItem(props) {
  return (
    <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '70vw' }}>
      <Grid container sx={{ width: '70vw'}} spacing={1}>
       <Grid item xs={2}>
       <Image src={props.image} alt="Pantry Item" width={100} height={100} />
       </Grid>
        <Grid item xs={10}>
          {props.name}
        </Grid>
        <Grid item xs={2}>Quantity</Grid>
        <Grid item xs={1}>
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="plus">
            <Remove />
          </IconButton>
        </Grid>
      
        <Grid item xs={1.1}>
          <TextField value={props.quantity}></TextField>
        </Grid>
        <Grid item xs={1}>
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="plus">
            <Add />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  )
}
