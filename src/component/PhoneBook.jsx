import React, { useState } from 'react'
import { Input, Typography, InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions, InputLabel, Select, MenuItem, TableBody, TableRow, TableContainer } from '@mui/material'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import { useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkAddTwoToneIcon from '@mui/icons-material/BookmarkAddTwoTone';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';





function PhoneBook() {

    const [open, setOpen] = useState(false);


    const [name, setName] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [label, setLabel] = useState('');

    const [contacts, setContacts] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [Edit, setEdit] = useState(false);
    const [Editindex, setEditindex] = useState('null');
    const [imageFile, setimageFile] = useState(null);
    const [imageUrl, setimageUrl] = useState('');
    const [currentPage, setcurrentPage] = useState(1);

    // it will be contacts per page on single page 
    const pageSize = 5;


    const totalcontacts = contacts.length;
    const indexofLastContact = currentPage * pageSize;
    const indexofFirstContact = indexofLastContact - pageSize;



    const handlePageChange = (pageNumber) => {
        setcurrentPage(pageNumber);
    };

    const pageNumber = [];
    for (let i = 1; i <= Math.ceil(totalcontacts / pageSize); i++) {
        pageNumber.push(i);
    }



    // fetching the data from localstorage if we reload it
    useEffect(() => {
        const savedContacts = localStorage.getItem('contacts');
        if (savedContacts) {
            setContacts(JSON.parse(savedContacts));
        }
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setEdit(false);
        setEditindex('null');
        setName('');
        setAddress('');
        setPhoneNumber('');
        setLabel('');
        setimageUrl('');
    }
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        setimageFile(file);


        const formData = new FormData();
        formData.append("file", file);
        formData.append('upload_preset', "my_unsigned_upload")
        console.log("FormData", formData.file)

        try {
            // CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dzlf5xfe3
            const response = await fetch('https://api.cloudinary.com/v1_1/dzlf5xfe3/image/upload', {
                // const response = await fetch('https://cloudinary://477794365294579:zvaEXmvilS4rACgptj39fYIkXHs@dzlf5xfe3', {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            setimageUrl(data.secure_url);
            console.log(data);
            console.log("Image URL:", data.secure_url);
            setimageUrl(data.secure_url);
        }
        catch (error) {
            console.log("this is error", error);
        }
    };

    const handleAddorEditContact = () => {
        if (name && phonenumber && label) {
            const newContact = { name, phonenumber, address, label, imageUrl };

            if (Edit) {
                // edit pr index check krke edit krga 
                const updatedContancts = [...contacts];
                updatedContancts[Editindex] = newContact;
                setContacts(updatedContancts);
                localStorage.setItem('contacts', JSON.stringify(updatedContancts));
            }
            else {
                // add pr naya contact
                const updatedContacts = [...contacts, newContact];
                setContacts(updatedContacts);
                localStorage.setItem('contacts', JSON.stringify(updatedContacts));
            }
            handleClose();
        }
    };



    const handleDelete = (index) => {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
        localStorage.setItem('contacts', JSON.stringify(updatedContacts))
    }

    const handleEdit = (index) => {
        // set existing data on edit
        const contact = contacts[index];
        setName(contact.name);
        setPhoneNumber(contact.phonenumber);
        setAddress(contact.address);
        setLabel(contact.label);
        // setimageFile(contacts.imageFile);
        setimageUrl(contact.imageUrl)
        setEditindex(index);
        setEdit(true);
        setOpen(true);

    }
    const filterContacts = contacts.filter(contact => {
        const filtereddata = contact.name.toLowerCase().includes(searchFilter.toLowerCase())
        // console.log(filtereddata);
        const filteredlabel = label ? contact.label === label : 'false';
        // console.log(filteredlabel);
        return filtereddata && filteredlabel;
    })




    return (
        <Box sx={{ padding: 2 }}>


            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    width: '100%'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountCircleRoundedIcon color='primary' />
                    <Typography variant="h6">PhoneBook</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <TextField
                        id="outlined-basic"
                        label="Search"
                        variant="outlined"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        sx={{ width: '100%', maxWidth: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                    {/* <FilterAltTwoToneIcon sx={{ size: 'large', color: 'blue' }} /> */}
                    {/* <InputLabel>Label</InputLabel> */}

                    <InputLabel>Label</InputLabel>
                    <Select
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    >
                        <MenuItem value='Work'>Work</MenuItem>
                        <MenuItem value="School">School</MenuItem>
                        <MenuItem value="Friends">Friends</MenuItem>
                        <MenuItem value="Family">Family</MenuItem>
                    </Select>




                    <Button
                        variant='contained'
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: 2 }}
                        onClick={handleClickOpen}
                    >
                        create contact
                    </Button>
                </Box>
            </Box>
            <Dialog open={open} >
                <DialogTitle>
                    {Edit ? 'Edit Contact' : 'New Contact'}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label='Name'
                        value={name}
                        type='text'
                        onChange={(e) => setName(e.target.value)}>

                    </TextField>

                    <TextField
                        label='Phone Number'
                        value={phonenumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type='number'>
                    </TextField>

                    <TextField
                        label='Address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type='text'>
                    </TextField>

                    <TextField
                        // label='Image'
                        onChange={handleImageUpload}
                        type='file'>
                    </TextField>


                    <InputLabel>Label</InputLabel>
                    <Select
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    >
                        <MenuItem value='Work'>Work</MenuItem>
                        <MenuItem value="School">School</MenuItem>
                        <MenuItem value="Friends">Friends</MenuItem>
                        <MenuItem value="Family">Family</MenuItem>
                    </Select>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddorEditContact} variant='contained'>
                        {Edit ? 'Save Changes' : 'Add Contact'}
                    </Button>
                    <Button onClick={handleClose}>
                        <Close />
                    </Button>
                </DialogActions>
            </Dialog>
            <Box sx={{ marginTop: 4 }}>



                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <TableContainer component={Paper} sx={{ width: '80%' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Phone</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            {/* <TableBody>
                                {filterContacts.map((contacts, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', textAlign: 'center' }}>
                                                {
                                                    contacts.imageUrl && (
                                                        <Avatar
                                                            src={contacts.imageUrl}
                                                            alt='avatar'
                                                            sx={{ width: 32, height: 32, marginRight: 1 }}
                                                        />
                                                    )}
                                                {contacts.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{contacts.phonenumber}</TableCell>
                                        <TableCell>
                                            <EditIcon onClick={() => handleEdit(index)} />
                                            <DeleteIcon onClick={() => handleDelete(index)} />
                                            <BookmarkAddTwoToneIcon sx={{
                                                ":hover": {
                                                    color: '#000000'
                                                }
                                            }}>

                                            </BookmarkAddTwoToneIcon>

                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody> */}

                            <TableBody>
                                {filterContacts.slice(indexofFirstContact, indexofLastContact).map((contact, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', textAlign: 'center' }}>
                                                {contact.imageUrl && (
                                                    <Avatar
                                                        src={contact.imageUrl}
                                                        alt='avatar'
                                                        sx={{ width: 32, height: 32, marginRight: 1 }}
                                                    />
                                                )}
                                                {contact.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{contact.phonenumber}</TableCell>
                                        <TableCell>
                                            <EditIcon onClick={() => handleEdit(index+indexofFirstContact)} />
                                            <DeleteIcon onClick={() => handleDelete(index+indexofLastContact)} />
                                            <BookmarkAddTwoToneIcon sx={{
                                                ":hover": {
                                                    color: '#000000'
                                                }
                                            }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>
                </Box>

                <Box sx={{ maxWidth: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <>
                        <Pagination
                            count={pageNumber.length}
                            page={currentPage}
                            onChange={(e, p) => handlePageChange(p)}
                        />
                    </>
                </Box>

            </Box>
        </Box>
    );
}

export default PhoneBook;
