import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import axios from "axios"
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    console.log("FormDAta:", formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await axios.post("http://localhost:8000/users/register", formData)
            console.log(response, "resss");
            if (response.data.success == true) {
                setLoading(false)
                setFormData({ name: "", email: "", password: "" })
                alert(response.data.message)
                navigate('/')
            }

        } catch (error) {
            setLoading(false)
            console.log(error);
            if (error.response) {
                alert(error.response.data.message || "Something went wrong.");
            } else {
                alert("Internal server error.");
            }
        }

    };

    return (

        <>
            {loading && <Loader />}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                bgcolor="#FF775C"
                px={2}
            >
                <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
                    <Typography variant="h5" gutterBottom align="center"
                        sx={{

                            fontWeight: "bold",
                            fontSize: "24px",
                            color: "#FF5533"
                        }}
                    >
                        Register
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                            inputProps={{
                                style: {
                                    textTransform: 'capitalize'
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            type="email"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2

                            }}
                        >
                            Submit
                        </Button>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ mt: 3, fontSize: "13px" }}
                        >
                            Already have an account?{' '}
                            <Box
                                component="span"
                                sx={{
                                    color: '#FF5533',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                                onClick={() => navigate('/')}
                            >
                                Login
                            </Box>
                        </Typography>


                    </form>
                </Paper>
            </Box>

        </>
    )
}

export default Register