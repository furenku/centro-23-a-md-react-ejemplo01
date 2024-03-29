import { useState, useEffect } from "react"

import Product from "../Products/Product/Product"
import Category from "../Categories/Category/Category"

import Cart from "../Cart/Cart"

import ShopView from "./ShopView/ShopView"

import Confirmation from "../Confirmation/Confirmation"

import styles from "./Shop.module.css"

import PropTypes from 'prop-types';


const Shop = ({ categories, products }) => {

    const [ filterType, setFilterType ] = useState( "SINGLE" )


    const [ currentCategories, setCurrentCategories ] = useState([])
    const [ lastMultipleChoice, setLastMultipleChoice ] = useState([])

    const [ filteredProducts, setFilteredProducts ] = useState([])

    const [ currentProducts, setCurrentProducts ] = useState([])
    
    
    const [ screen, setScreen ] = useState("SHOP")

    let renderProducts
    let renderCategories


    // Al inicializar
    useEffect(() => {
        setFilteredProducts( products )
    }, [])

    // reaccionar al cambiar las categorías seleccionadas
    useEffect(()=>{
        if( currentCategories.length > 0 ) {
            // elegir productos cuyas categorías están en la selección actual
            const productsInCurrentCategories = products.filter( product => {
                // buscamos si alguna de las categorías del
                // producto está en la lista de seleccionadas
                return !! product.categories.find(
                    productCategory => currentCategories.includes( productCategory )
                )
            })
            setFilteredProducts( productsInCurrentCategories )
        } else {
            // si no está seleccionada ninguna categoría:
            // mostrar todos los productos
            setFilteredProducts( products )
        }
    }, [ currentCategories ])


    const chooseCategory = ( id ) => {
        console.log("Chose", id )
        if( filterType == "SINGLE" ) {
            setCurrentCategories( [ id ] )
        } else {
            let copy = [ ...currentCategories ]
            if( copy.includes( id ) ) {
                // retirar categoría clicada del arreglo:
                // const index = copy.indexOf( id )
                // copy.splice( index, 1 )
                copy = copy.filter( x => x != id )
            } else {
                // agregar categoría clicada al arreglo:
                copy.push( id )
            }
            setCurrentCategories( copy )
            setLastMultipleChoice( copy )
        }
    }


    const chooseProduct = id => {
        console.log("Chose product:", id )

        let copy = [ ...currentProducts ]
        if( copy.includes( id ) ) {
            // retirar producto clicado del arreglo:
            copy = copy.filter( x => x != id )
        } else {
            // agregar producto clicado al arreglo:
            copy.push( id )
        }
        setCurrentProducts( copy )
        
    }


    if( Array.isArray( categories ) && categories.length > 0 ) {
        renderCategories = categories.map( (category, i) => (
            <Category
                {...category}
                chosen={ currentCategories.includes( category.id ) }
                choose={ ()=>chooseCategory( category.id ) }
                key={ `category-${i}` }
            />
        ))
    } else {
        renderCategories = (
            <div className="error">
                Categories list is empty
            </div>
        )
    }
    
    if( Array.isArray( filteredProducts ) && filteredProducts.length > 0 ) {
        renderProducts = filteredProducts.map( (product, i) => (
            <Product
                {...product}
                key={ `product-${i}` }
                choose={ ()=>chooseProduct( product.id ) }
                chosen={ currentProducts.includes( product.id ) }
            />
        ))   
    } else {
        renderProducts = (
            <div className="error">
                Products list is empty
            </div>
        )
    }

    const changeFilter = () => {
        if( filterType == "SINGLE" ) {
            setFilterType("MULTIPLE")

            setCurrentCategories( lastMultipleChoice )
            
        } else {
            setFilterType("SINGLE")
        }
    }


    const getProductById = id => products.find( p => p.id == id )

    const getCartQuantity = () => {
        return currentProducts.length
    }

    const getCartCost = () => {
        return currentProducts.reduce(
            ( acc, p ) => acc += getProductById(p).cost,
            0
        )
    }


    const openCheckout = () => {
        setScreen("CHECKOUT")
    }
    
    const openConfirmation = () => {
        setScreen("CONFIRMATION")
    }


    switch( screen ) {

        case "SHOP":

            return (
                <ShopView
                    quantity={ getCartQuantity() }
                    cost={ getCartCost() }
                    openCheckout={ openCheckout }
                    changeFilter={ changeFilter }
                    filterType={ filterType }
                    categories={ renderCategories }
                    products={ renderProducts }
                />
            )
            
            // break

        case "CHECKOUT":
            
            const currentProductsListItems = currentProducts.map( id => products.find( p => p.id == id ) )
            
            return (
                <Confirmation
                    products={ currentProductsListItems }
                    action={ openConfirmation }
                    total={ getCartCost() }
                />
            )
    
            // break
        case "CONFIRMATION":
            return (
                <h1>
                    Orden recibida
                </h1>
            )
            // break


    }

            
}

Shop.propTypes = {
}

export default Shop