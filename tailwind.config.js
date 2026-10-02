/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Nunito"', 'sans-serif'],
                serif: ['"Fraunces"', 'serif'],
            },
            colors: {
                gray: {
                    50: '#fcfaf7', 
                    100: '#f3eee7',
                    200: '#e5d9cc',
                    300: '#d1bfae',
                    400: '#a39185',
                    500: '#8b7e7c', 
                    600: '#756866',
                    700: '#5e504f', 
                    800: '#4a3d3c',
                    900: '#3d3130', 
                },
                indigo: {
                    50: '#eaf2e8', 
                    100: '#d5e5d1', 
                    400: '#a8c6a2',
                    500: '#93b38c', 
                    600: '#93b38c', 
                    700: '#7a9a73', 
                    800: '#62825a',
                    900: '#496642',
                },
                orange: {
                    50: '#fef4ea',
                    100: '#fae5d3',
                    400: '#f0b99a',
                    500: '#e6a27a',
                    600: '#db8d60',
                    700: '#cc7447',
                }
            }
        },
    },
    plugins: [],
}
