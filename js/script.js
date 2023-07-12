'use strict'

// dom elements
let dropdown = document.querySelector('.dropdown-menu')
let input = document.getElementById('input')
let btn = document.querySelector(".btn")
let back = document.getElementById("btn")
let img = document.getElementById("img")
let currentTemp = document.querySelector(".current-temp")
let description =document.querySelector(".description")
let location1 = document.getElementById("location")
let feelslike =document.getElementById("feelslike")
let humadity =document.getElementById("humadity")
let section1 = document.querySelector(".first-activity")
let section2 = document.querySelector(".details")
let changeBtn = document.querySelector('.change-icon-btn')
let enter = document.querySelector('.enter-btn')
countryLoad()


// listeners 
input.addEventListener('focus',function(){
    dropdown.setAttribute('disabled','')
})
dropdown.addEventListener('focus',function(){
    input.setAttribute('disabled','')
})

addEventListener('keydown',function(e){
    if(e.key=='Enter'){
    changeActivity()
}
})

enter.addEventListener('click',()=>changeActivity())

changeBtn.addEventListener('click',function(){
    if(dropdown.hasAttribute('disabled')) {
        input.setAttribute('disabled','')
        dropdown.removeAttribute('disabled')
        input.value = ''
    }else{
        dropdown.setAttribute('disabled','')
        input.removeAttribute('disabled')
        dropdown.value = ''
    }
})

back.addEventListener('click',function(){
    section1.classList.remove("disable-none")
    section2.classList.add("disable-none")
})


btn.addEventListener('click',function(){
    const prom = new Promise (function(resolve,reject){
        navigator.geolocation.getCurrentPosition(resolve,reject)
    })
    try{
    prom.then(pos=>{
        const lat = pos.coords.latitude
        const long = pos.coords.longitude
        return fetch(`https://geocode.xyz/${lat},${long}?geoit=json&auth=63748590785425252020x3080`)
    }).then(res=>res.json()).
        then(data=>{
            console.log(data.region)
            rendering(data.region)
        })
    }catch(err){
        console.error(`${err} from me`)
    }
})


// functions 

// rendering countries in the dropdown menu
async function countryLoad(){
    try{
    const res = await fetch("https://restcountries.com/v3.1/all")
    const data = await res.json()
    let countriesArray = []
    for(let i of data){
        if (i.capital != undefined){
            countriesArray.push(i.capital[0])
        }
    countriesArray.sort()
    }
    for(let i of countriesArray){
        // add the options into the select in html
        let option =document.createElement('option')
        option.value = `${i}`
        option.textContent = `${i}`
        dropdown.appendChild(option)}
    }catch(err){
        console.error(err)
    }
}


function rendering (country){
    fetch(`https:weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${country}?unitGroup=us&key=QF4TTWSAZQX53ZYMXBVGJWT3M`).
    then(res=>res.json()).
    then(data=>{
        console.log(data)
        currentTemp.textContent = `${(((data.currentConditions.temp)-32)*(5/9)).toFixed(1)}°C`
        description.textContent = `${data.currentConditions.conditions}`
        location1.textContent = `${data.resolvedAddress}`
        feelslike.textContent = `${(((data.currentConditions.feelslike)-32)*(5/9)).toFixed(1)}`
        humadity.textContent = `${data.currentConditions.humidity}`
    }).catch(err=>{
        console.error(err)
    })
    section1.classList.add("disable-none")
    section2.classList.remove("disable-none")
}

function changeActivity(){
    if(!(input.value || dropdown.value)){
        alert('please enter the country or choose it')
        return
    }
    let country = dropdown.hasAttribute("disabled")?input.value:dropdown.value
    rendering(country)

}