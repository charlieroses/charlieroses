//Written by Charlie Chiccarine August 2019 for purposes of
//demonstrating Data Simulation for preparation for the Praxis
//computer science exam

import java.util.*;

public class weight
{
	public static void main(String[] args)
	{
		Scanner input = new Scanner(System.in);
		
		//Starting information
		int startAge = 20,
			startWeight = 150;
		
		//How many years will pass?
		System.out.print("How many years will pass: ");
		int yearsPass = input.nextInt();

		//Convert that to weeks since that's what our formula uses
		int weeksPass = yearsPass * 52;

		//Get the final results
		int finalAge = startAge + yearsPass;
		int finalWeight = startWeight + (5 * weeksPass);
		System.out.println("At age " + finalAge + 
				" you will be " + finalWeight + " lbs");
	}
}
