// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "hardhat/console.sol";

/*
* The Ricardian Smart Contract for MetaRent - Car Contract
 */


// Car Struct
struct Car {
    string Name;
    string Model;
    string EngineId;
    string Colour;
}

// Rental Struct
struct Rental {
    address Driver;
    

}

contract CarContract {


/** Constructor */
constructor CarContract(){

}


}