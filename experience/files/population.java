//Original Python Code Written By M. Boady, D. Augenblick, B. Char 
//
//Modified by Charlie Chiccarine August 2019 for purposes of
//demonstrating Data Simulation for preparation for the Praxis
//computer science exam


import java.util.*;
import java.lang.*;

public class population
{
	public static void main(String[] args)
	{
		Scanner input = new Scanner(System.in);

		//Sets up the simulation
		System.out.println("Population Simulator");
		System.out.print("\n Enter starting number of rabbits: ");
		int initRabbit = input.nextInt();
		System.out.print("\n Enter starting number of foxes: ");
		int initFoxes = input.nextInt();
		System.out.print("\n How many years to simulate: ");
		int years = input.nextInt();
		
		double  currRabbits = initRabbit,
				currFoxes = initFoxes,
				newRabbits = initRabbit,
				newFoxes = initFoxes;
	
		//Some other variables for environmental things
		//growth rate, food available, etc
		double a = 0.04,
			   b = 0.0005,
			   g = 0.2,
			   s = 0.00005;


		//Perform the simulation and create a table

		System.out.println("Years,Rabbits,Foxes");

		for( int i = 1; i <= years; i++)
		{
			newRabbits = currRabbits + Math.floor( currRabbits * (a - b * currFoxes));
			newFoxes = currFoxes - Math.floor( currFoxes * ( g - s * currRabbits));

			System.out.println(i + "," + (int) newRabbits + "," + (int) newFoxes);
			
			currRabbits = newRabbits;
			currFoxes = newFoxes;
		}
		
		//Display results
		System.out.println("After " + years + " years,");
		System.out.println(initRabbit + " rabbits has become " + currRabbits);
		System.out.println(initFoxes + " foxes has become " + currFoxes);
	}
}
