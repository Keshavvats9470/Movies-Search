import React from 'react';
import wall from "../assets/wall.png"
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Splashscreen() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section class="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
            <div class="absolute inset-0">
                <img src={wall} alt="Background" class="object-cover object-center w-full h-full brightness-150" />
                <div class="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div class="relative z-10 flex flex-col justify-center items-center h-full text-center">
                <motion.div className="image-content space-y-2 z-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible">
                    <motion.h1
                        className="font-light text-6xl"
                        variants={itemVariants}
                        transition={{ duration: 1 }}
                        class="text-6xl font-bold leading-tight mb-4">Welcome to the Website</motion.h1>
                </motion.div>
                <p class="text-lg text-gray-300 mb-8">You can Login or Sign-up!</p>
                <Link to={`/sign-up-user-authentication`} class="bg-purple-500 text-gray-100 tracking-[1px] hover:bg-purple-700 py-2 px-6 rounded-full text-lg transition duration-300 ease-in-out font-bold transform hover:scale-105 hover:shadow-lg">Register</Link>
            </div>
        </section>

    )
}

export default Splashscreen