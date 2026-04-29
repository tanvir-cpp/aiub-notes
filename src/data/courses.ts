import type { Course } from "../types";

export const courses: Course[] = [
  {
    "id": "MAT1102-1",
    "semester": 1,
    "code": "MAT1102",
    "title": "DIFFERENTIAL CALCULUS & CO-ORDINATE GEOMETRY",
    "prerequisite": null,
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "PHY1101-2",
    "semester": 1,
    "code": "PHY1101",
    "title": "PHYSICS 1",
    "prerequisite": null,
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "PHY1102-3",
    "semester": 1,
    "code": "PHY1102",
    "title": "PHYSICS 1 LAB",
    "prerequisite": null,
    "credit": "1",
    "category": "core",
    "major": null
  },
  {
    "id": "ENG1101-4",
    "semester": 1,
    "code": "ENG1101",
    "title": "ENGLISH READING SKILLS & PUBLIC SPEAKING",
    "prerequisite": null,
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC1101-5",
    "semester": 1,
    "code": "CSC1101",
    "title": "INTRODUCTION TO COMPUTER STUDIES",
    "prerequisite": null,
    "credit": "1",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC1103-6",
    "semester": 1,
    "code": "CSC1103",
    "title": "INTRODUCTION TO PROGRAMMING LAB",
    "prerequisite": null,
    "credit": "1",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC1102-7",
    "semester": 1,
    "code": "CSC1102",
    "title": "INTRODUCTION TO PROGRAMMING",
    "prerequisite": null,
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC1204-8",
    "semester": 2,
    "code": "CSC1204",
    "title": "DISCRETE MATHEMATICS",
    "prerequisite": "MAT1102 & CSC1102",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "MAT1205-9",
    "semester": 2,
    "code": "MAT1205",
    "title": "INTEGRAL CALCULUS & ORDINARY DIFFERENTIAL EQUATIONS",
    "prerequisite": "MAT1102",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC1205-10",
    "semester": 2,
    "code": "CSC1205",
    "title": "OBJECT ORIENTED PROGRAMMING 1",
    "prerequisite": "CSC1102 & CSC1103",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "PHY1203-11",
    "semester": 2,
    "code": "PHY1203",
    "title": "PHYSICS 2",
    "prerequisite": "PHY1101",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "PHY1204-12",
    "semester": 2,
    "code": "PHY1204",
    "title": "PHYSICS 2 LAB",
    "prerequisite": "PHY1102",
    "credit": "1",
    "category": "core",
    "major": null
  },
  {
    "id": "ENG1202-13",
    "semester": 2,
    "code": "ENG1202",
    "title": "ENGLISH WRITING SKILLS & COMMUNICATIONS",
    "prerequisite": "ENG1101",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "COE2101-14",
    "semester": 2,
    "code": "COE2101",
    "title": "INTRODUCTION TO ELECTRICAL CIRCUITS",
    "prerequisite": "PHY1101",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "COE2102-15",
    "semester": 2,
    "code": "COE2102",
    "title": "INTRODUCTION TO ELECTRICAL CIRCUITS LAB",
    "prerequisite": "PHY1102",
    "credit": "1",
    "category": "core",
    "major": null
  },
  {
    "id": "CHEM1101-16",
    "semester": 3,
    "code": "CHEM1101",
    "title": "CHEMISTRY",
    "prerequisite": "PHY1203",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "MAT2101-17",
    "semester": 3,
    "code": "MAT2101",
    "title": "COMPLEX VARIABLE, LAPLACE & Z-TRANSFORMATION",
    "prerequisite": "MAT1205",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC2108-18",
    "semester": 3,
    "code": "CSC2108",
    "title": "INTRODUCTION TO DATABASE",
    "prerequisite": "CSC1205",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "EEE2104-19",
    "semester": 3,
    "code": "EEE2104",
    "title": "ELECTRONIC DEVICES LAB",
    "prerequisite": "COE2102",
    "credit": "1",
    "category": "core",
    "major": null
  },
  {
    "id": "BBA1102-20",
    "semester": 3,
    "code": "BBA1102",
    "title": "PRINCIPLES OF ACCOUNTING",
    "prerequisite": "MAT1205",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "EEE2103-21",
    "semester": 3,
    "code": "EEE2103",
    "title": "ELECTRONIC DEVICES",
    "prerequisite": "COE2101",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC2106-22",
    "semester": 3,
    "code": "CSC2106",
    "title": "DATA STRUCTURE",
    "prerequisite": "CSC1204 & CSC1205",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC2107-23",
    "semester": 3,
    "code": "CSC2107",
    "title": "DATA STRUCTURE LAB",
    "prerequisite": "CSC1204 & CSC1205",
    "credit": "1",
    "category": "core",
    "major": null
  },
  {
    "id": "BAE2101-24",
    "semester": 3,
    "code": "BAE2101",
    "title": "COMPUTER AIDED DESIGN & DRAFTING",
    "prerequisite": null,
    "credit": "1",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC2211-25",
    "semester": 4,
    "code": "CSC2211",
    "title": "ALGORITHMS",
    "prerequisite": "CSC2106",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "MAT2202-26",
    "semester": 4,
    "code": "MAT2202",
    "title": "MATRICES, VECTORS, FOURIER ANALYSIS",
    "prerequisite": "MAT2101",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC2210-27",
    "semester": 4,
    "code": "CSC2210",
    "title": "OBJECT ORIENTED PROGRAMMING 2",
    "prerequisite": "CSC2106 & CSC2108",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC2209-28",
    "semester": 4,
    "code": "CSC2209",
    "title": "OBJECT ORIENTED ANALYSIS AND DESIGN",
    "prerequisite": "CSC2108",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "BAS2101-29",
    "semester": 4,
    "code": "BAS2101",
    "title": "BANGLADESH STUDIES",
    "prerequisite": "CSC1101",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "EEE3101-30",
    "semester": 4,
    "code": "EEE3101",
    "title": "DIGITAL LOGIC AND CIRCUITS",
    "prerequisite": "EEE2103",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "EEE3102-31",
    "semester": 4,
    "code": "EEE3102",
    "title": "DIGITAL LOGIC AND CIRCUITS LAB",
    "prerequisite": "EEE2104",
    "credit": "1",
    "category": "core",
    "major": null
  },
  {
    "id": "MAT3103-32",
    "semester": 4,
    "code": "MAT3103",
    "title": "COMPUTATIONAL STATISTICS AND PROBABILITY",
    "prerequisite": "MAT2101",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC3113-33",
    "semester": 5,
    "code": "CSC3113",
    "title": "THEORY OF COMPUTATION",
    "prerequisite": "CSC2211",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "ECO3150-34",
    "semester": 5,
    "code": "ECO3150",
    "title": "PRINCIPLES OF ECONOMICS",
    "prerequisite": "MAT3103",
    "credit": "2",
    "category": "core",
    "major": null
  },
  {
    "id": "ENG2103-35",
    "semester": 5,
    "code": "ENG2103",
    "title": "BUSINESS COMMUNICATION",
    "prerequisite": "BAS2101",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "MAT3101-36",
    "semester": 5,
    "code": "MAT3101",
    "title": "NUMERICAL METHODS FOR SCIENCE AND ENGINEERING",
    "prerequisite": "MAT2202",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "COE3103-37",
    "semester": 5,
    "code": "COE3103",
    "title": "DATA COMMUNICATION",
    "prerequisite": "EEE3101 & EEE3102",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "COE3104-38",
    "semester": 5,
    "code": "COE3104",
    "title": "MICROPROCESSOR AND EMBEDDED SYSTEMS",
    "prerequisite": "EEE3101 & EEE3102",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC3112-39",
    "semester": 5,
    "code": "CSC3112",
    "title": "SOFTWARE ENGINEERING",
    "prerequisite": "CSC2209",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC3217-40",
    "semester": 6,
    "code": "CSC3217",
    "title": "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM",
    "prerequisite": "CSC2211 & MAT3103",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "COE3206-41",
    "semester": 6,
    "code": "COE3206",
    "title": "COMPUTER NETWORKS",
    "prerequisite": "COE3103",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "COE3205-42",
    "semester": 6,
    "code": "COE3205",
    "title": "COMPUTER ORGANIZATION AND ARCHITECTURE",
    "prerequisite": "COE3104",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC3214-43",
    "semester": 6,
    "code": "CSC3214",
    "title": "OPERATING SYSTEM",
    "prerequisite": "CSC2211 & COE3104",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC3215-44",
    "semester": 6,
    "code": "CSC3215",
    "title": "WEB TECHNOLOGIES",
    "prerequisite": "CSC3112",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "EEE2216-45",
    "semester": 6,
    "code": "EEE2216",
    "title": "ENGINEERING ETHICS",
    "prerequisite": "CSC3112 & COE3104",
    "credit": "2",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC3216-46",
    "semester": 6,
    "code": "CSC3216",
    "title": "COMPILER DESIGN",
    "prerequisite": "CSC3113",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC4118-47",
    "semester": 7,
    "code": "CSC4118",
    "title": "COMPUTER GRAPHICS",
    "prerequisite": "CSC2211 & MAT2202",
    "credit": "3/LAB",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC-----48",
    "semester": 7,
    "code": "CSC****",
    "title": "COS ELECTIVE 1",
    "prerequisite": null,
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "MGT3202-49",
    "semester": 7,
    "code": "MGT3202",
    "title": "ENGINEERING MANAGEMENT",
    "prerequisite": "EEE2216",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC4197-50",
    "semester": 7,
    "code": "CSC4197",
    "title": "RESEARCH METHODOLOGY",
    "prerequisite": "100 Credits",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC-----51",
    "semester": 7,
    "code": "CSC####",
    "title": "CSE MAJOR 1",
    "prerequisite": null,
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC-----52",
    "semester": 7,
    "code": "CSC####",
    "title": "CSE MAJOR 2",
    "prerequisite": null,
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC-----53",
    "semester": 7,
    "code": "CSC####",
    "title": "CSE MAJOR 3",
    "prerequisite": null,
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC4299-54",
    "semester": 8,
    "code": "CSC4299",
    "title": "THESIS",
    "prerequisite": "CSC4197",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC-----55",
    "semester": 8,
    "code": "CSC****",
    "title": "COS ELECTIVE 2",
    "prerequisite": null,
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC4296-56",
    "semester": 8,
    "code": "CSC4296",
    "title": "INTERNSHIP",
    "prerequisite": "139 Credits",
    "credit": "3",
    "category": "core",
    "major": null
  },
  {
    "id": "CSC4181-57",
    "semester": null,
    "code": "CSC4181",
    "title": "ADVANCE DATABASE MANAGEMENT SYSTEM",
    "prerequisite": "CSC2108",
    "credit": "3/LAB",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "MIS3101-58",
    "semester": null,
    "code": "MIS3101",
    "title": "MANAGEMENT INFORMATION SYSTEM",
    "prerequisite": "CSC3112",
    "credit": "3",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "MIS4011-59",
    "semester": null,
    "code": "MIS4011",
    "title": "ENTERPRISE RESOURCE PLANNING",
    "prerequisite": "MIS3101 & CSC3112",
    "credit": "3",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "CSC4285-60",
    "semester": null,
    "code": "CSC4285",
    "title": "DATA WAREHOUSE AND DATA MINING",
    "prerequisite": "CSC2211 & MAT3103",
    "credit": "3",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "CSC4182-61",
    "semester": null,
    "code": "CSC4182",
    "title": "HUMAN COMPUTER INTERACTION",
    "prerequisite": "CSC3217 & CSC3215",
    "credit": "3",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "MIS4014-62",
    "semester": null,
    "code": "MIS4014",
    "title": "BUSINESS INTELLIGENCE AND DECISION SUPPORT SYSTEMS",
    "prerequisite": null,
    "credit": "3",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "CSC4180-63",
    "semester": null,
    "code": "CSC4180",
    "title": "INTRODUCTION TO DATA SCIENCE",
    "prerequisite": null,
    "credit": "3",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "CSC4183-64",
    "semester": null,
    "code": "CSC4183",
    "title": "CYBER LAWS & INFORMATION SECURITY",
    "prerequisite": null,
    "credit": "3",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "MIS4007-65",
    "semester": null,
    "code": "MIS4007",
    "title": "DIGITAL MARKETING",
    "prerequisite": null,
    "credit": "3",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "MIS4012-66",
    "semester": null,
    "code": "MIS4012",
    "title": "E-COMMERCE, E-GOVERNANCE & E-SERIES",
    "prerequisite": null,
    "credit": "3",
    "category": "major",
    "major": "Information Systems"
  },
  {
    "id": "CSC4270-67",
    "semester": null,
    "code": "CSC4270",
    "title": "SOFTWARE DEVELOPMENT PROJECT MANAGEMENT",
    "prerequisite": "CSC3112",
    "credit": "3",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4160-68",
    "semester": null,
    "code": "CSC4160",
    "title": "SOFTWARE REQUIREMENT ENGINEERING",
    "prerequisite": "CSC3112",
    "credit": "3",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4271-69",
    "semester": null,
    "code": "CSC4271",
    "title": "SOFTWARE QUALITY AND TESTING",
    "prerequisite": "CSC3112",
    "credit": "3",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4162-70",
    "semester": null,
    "code": "CSC4162",
    "title": "PROGRAMMING IN PYTHON",
    "prerequisite": "CSC3215",
    "credit": "3/LAB",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4274-71",
    "semester": null,
    "code": "CSC4274",
    "title": "VIRTUAL REALITY SYSTEMS DESIGN",
    "prerequisite": "CSC2210",
    "credit": "3",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4163-72",
    "semester": null,
    "code": "CSC4163",
    "title": "ADVANCED PROGRAMMING WITH JAVA",
    "prerequisite": "CSC3215",
    "credit": "3/LAB",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4164-73",
    "semester": null,
    "code": "CSC4164",
    "title": "ADVANCED PROGRAMMING WITH .NET",
    "prerequisite": "CSC3215",
    "credit": "3/LAB",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4161-74",
    "semester": null,
    "code": "CSC4161",
    "title": "ADVANCED PROGRAMMING IN WEB TECHNOLOGY",
    "prerequisite": "CSC3215",
    "credit": "3/LAB",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4272-75",
    "semester": null,
    "code": "CSC4272",
    "title": "MOBILE APPLICATION DEVELOPMENT",
    "prerequisite": "CSC3215",
    "credit": "3/LAB",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4273-76",
    "semester": null,
    "code": "CSC4273",
    "title": "SOFTWARE ARCHITECTURE AND DESIGN PATTERNS",
    "prerequisite": "CSC3112",
    "credit": "3",
    "category": "major",
    "major": "Software Engineering"
  },
  {
    "id": "CSC4125-77",
    "semester": null,
    "code": "CSC4125",
    "title": "COMPUTER SCIENCE MATHEMATICS",
    "prerequisite": "CSC2211 & MAT3101",
    "credit": "3",
    "category": "major",
    "major": "Computational Theory"
  },
  {
    "id": "CSC4126-78",
    "semester": null,
    "code": "CSC4126",
    "title": "BASIC GRAPH THEORY",
    "prerequisite": "CSC2211",
    "credit": "3",
    "category": "major",
    "major": "Computational Theory"
  },
  {
    "id": "CSC4127-79",
    "semester": null,
    "code": "CSC4127",
    "title": "ADVANCED ALGORITHM TECHNIQUES",
    "prerequisite": "CSC3217",
    "credit": "3/LAB",
    "category": "major",
    "major": "Computational Theory"
  },
  {
    "id": "CSC4233-80",
    "semester": null,
    "code": "CSC4233",
    "title": "NATURAL LANGUAGE PROCESSING",
    "prerequisite": "CSC3217 & CSC4162",
    "credit": "3",
    "category": "major",
    "major": "Computational Theory"
  },
  {
    "id": "CSC4128-81",
    "semester": null,
    "code": "CSC4128",
    "title": "LINEAR PROGRAMMING",
    "prerequisite": "CSC3217 & MAT3103",
    "credit": "3/LAB",
    "category": "major",
    "major": "Computational Theory"
  },
  {
    "id": "CSC4231-82",
    "semester": null,
    "code": "CSC4231",
    "title": "PARALLEL COMPUTING",
    "prerequisite": "CSC3217",
    "credit": "3",
    "category": "major",
    "major": "Computational Theory"
  },
  {
    "id": "CSC4232-83",
    "semester": null,
    "code": "CSC4232",
    "title": "MACHINE LEARNING",
    "prerequisite": "CSC3217",
    "credit": "3",
    "category": "major",
    "major": "Computational Theory"
  },
  {
    "id": "BAE1201-84",
    "semester": null,
    "code": "BAE1201",
    "title": "BASIC MECHANICAL ENGG.",
    "prerequisite": "PHY1203",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "EEE3103-85",
    "semester": null,
    "code": "EEE3103",
    "title": "DIGITAL SIGNAL PROCESSING",
    "prerequisite": "EEE2213",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "EEE4217-86",
    "semester": null,
    "code": "EEE4217",
    "title": "VLSI CIRCUIT DESIGN",
    "prerequisite": "EEE3101 & EEE3102",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "EEE2213-87",
    "semester": null,
    "code": "EEE2213",
    "title": "SIGNALS & LINEAR SYSTEM",
    "prerequisite": "MAT2202",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4128-88",
    "semester": null,
    "code": "COE4128",
    "title": "DIGITAL SYSTEM DESIGN",
    "prerequisite": "COE3205",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4231-89",
    "semester": null,
    "code": "COE4231",
    "title": "IMAGE PROCESSING",
    "prerequisite": "CSC4118 & EEE2213",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4129-90",
    "semester": null,
    "code": "COE4129",
    "title": "MULTIMEDIA SYSTEMS",
    "prerequisite": "CSC3215",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4230-91",
    "semester": null,
    "code": "COE4230",
    "title": "SIMULATION & MODELING",
    "prerequisite": "CSC3217",
    "credit": "3/LAB",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4126-92",
    "semester": null,
    "code": "COE4126",
    "title": "ADVANCED COMPUTER NETWORKS",
    "prerequisite": "COE3206",
    "credit": "3/LAB",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4234-93",
    "semester": null,
    "code": "COE4234",
    "title": "COMPUTER VISION AND PATTERN RECOGNITION",
    "prerequisite": "CSC4118",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4232-94",
    "semester": null,
    "code": "COE4232",
    "title": "NETWORK SECURITY",
    "prerequisite": "COE3103",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4125-95",
    "semester": null,
    "code": "COE4125",
    "title": "ADVANCED OPERATING SYSTEM",
    "prerequisite": "CSC3214",
    "credit": "3/LAB",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "EEE4233-96",
    "semester": null,
    "code": "EEE4233",
    "title": "DIGITAL DESIGN WITH SYSTEM [VERILOG, VHDL & FPGAS]",
    "prerequisite": "EEE4217",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4235-97",
    "semester": null,
    "code": "COE4235",
    "title": "ROBOTICS ENGINEERING",
    "prerequisite": "CSC3217",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "EEE4209-98",
    "semester": null,
    "code": "EEE4209",
    "title": "TELECOMMUNICATIONS ENGINEERING",
    "prerequisite": "COE3103",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4127-99",
    "semester": null,
    "code": "COE4127",
    "title": "NETWORK RESOURCE MANAGEMENT & ORGANIZATION",
    "prerequisite": "COE3103",
    "credit": "3",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "COE4233-100",
    "semester": null,
    "code": "COE4233",
    "title": "WIRELESS SENSOR NETWORKS",
    "prerequisite": "COE3103",
    "credit": "3/LAB",
    "category": "major",
    "major": "Computer Engineering"
  },
  {
    "id": "EEE4241-101",
    "semester": null,
    "code": "EEE4241",
    "title": "INDUSTRIAL ELECTRONICS, DRIVES & INSTRUMENTATION",
    "prerequisite": "EEE3101",
    "credit": "3/LAB",
    "category": "major",
    "major": "Computer Engineering"
  }
];
