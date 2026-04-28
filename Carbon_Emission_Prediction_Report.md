<center>
<h1>PROJECT REPORT ON</h1>
<h2>“Carbon Emission Prediction”</h2>
<br>
<b>Submitted By</b><br>
Mayur Ravidas Sonawane
<br><br>
<b>Under the Guidance of</b><br>
Miss. Panchariya<br>
Miss. Hase
<br><br>
<b>MASTER OF COMPUTER APPLICATION</b>
<br><br>
<b>S.N. ARTS, D.J.M. COMMERCE & B.N.S. SCIENCE COLLEGE SANGAMNER</b><br>
(AUTONOMOUS) COLLEGE<br>
AFFILIATED WITH<br>
SAVITRIBAI PHULE PUNE UNIVERSITY<br>
DURING ACADEMIC YEAR<br>
2025-2026
</center>

---

<center>
<b>SHIKSHAN PRASARAK SANSTHA’S</b><br>
<b>SANGAMNER NAGARPALIKA ARTS, D.J. MALPANI COMMERCE & B.N. SARDA SCIENCE COLLEGE SANGAMNER (AUTONOMOUS) COLLEGE</b><br>
-422605 Dist. –AHMEDNAGAR<br>
(Id No. PU/AN/ASC/03/1961)<br>
“Spread knowledge unto the last”
</center>

---

<center>
<h2>CERTIFICATE</h2>
</center>

This certificate is to certify the Project Entitled **“Carbon Emission Prediction”** is the bonafide work carried out by **Mayur Ravidas Sonawane** student of MASTER OF COMPUTER APPLICATION during year 2025-2026 in partial fulfilment of the requirement for the award of Master of Computer Application.

Date: ___ / ___ / 2026

**Project Guide** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Head Of Department**

<br><br>

**Internal Examiner** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **IT Expert** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **External Examiner**

---

## ACKNOWLEDGEMENT

I am using this opportunity to express my gratitude to everyone who supported me throughout the course of this MCA project. I am thankful for their aspiring guidance, invaluably constructive criticism and friendly advice during the project work. I am sincerely grateful to them for sharing their truthful and illuminating views on a number of issues related to the project.

Today I am very pleased as I am presenting the project report on the ML-Based website of "Carbon Emission Prediction".
I express my warm thanks to Miss. Panchariya and Miss. Hase for their support and guidance. Firstly we would to like to thank S. N. Arts, D. J. Malpani Commerce & B. N. Sarda Science College (Autonomous), Sangamner and Department of Computer Science for giving us an opportunity. 

I hereby take opportunity to regard my sincere thanks to my internal guides for their kind co-operation during the project. Their efforts have been monumental in the completion of this project. They have been very generous with their advice, views, ideas and always ensured that I was on the right track. Taking this opportunity, I would also like to thank our Principal Dr. A.H. Gaikwad, Head of Department, and Department of Computer Science Staff for their valuable guidance during development of my project and encouraging me.

Last but not least, I most thanks to all my friends, colleagues who helped me a lot throughout the project it is their support, cheerfulness, encouragement and helping nature with which our project might not have been completed.
Any omission in this brief acknowledgement does not meet lack of gratitude.

Thank You…!

**Mayur Ravidas Sonawane**
MASTER OF COMPUTER APPLICATION

---

## Index

| Ch. No | TITLE |
| :--- | :--- |
| **Chapter 1** | **Introduction** |
| 1.1 | Company Profile |
| 1.2 | Abstract |
| 1.3 | Problem Definition |
| 1.4 | Existing System & Need for System |
| 1.5 | Scope of System |
| **Chapter 2** | **Proposed System** |
| 2.1 | Feasibility Study |
| 2.2 | Fact Finding Technique |
| 2.3 | Objective of System |
| 2.4 | User Requirement |
| **Chapter 3** | **System Analysis & Design** |
| 3.1 | ER Diagram |
| 3.2 | UML Diagrams |
| **Chapter 4** | **Database Design** |
| **Chapter 5** | **User Interface** |
| 5.1 | Input/Output Screen |
| 5.2 | Report |
| **Chapter 6** | **Testing** |
| **Chapter 7** | **Advantages, Limitations and Proposed enhancement** |
| **Chapter 8** | **Conclusion** |
| **Chapter 9** | **Bibliography** |

<br><br><br><br>

---

## Chapter 1: Introduction

### 1.1 Company Profile
TechnoHacks Solutions Pvt. Ltd. is a cutting-edge software development company based in Nashik, Maharashtra. Established in 2022, our company has quickly gained recognition for our innovative solutions and commitment to excellence in the field of technology with a team of 40-50 dedicated professionals, we specialize in providing a wide range of services including Data Science, application development, corporate training, and digital marketing solutions.
Our mission is to empower businesses of all sizes by leveraging the latest technologies to enhance their online presence and streamline their operations. At TechnoHacks Solutions Pvt. Ltd., we take pride in our ability to deliver customized solutions that meet the unique needs and objectives of each client. Whether it's creating a dynamic website, developing a user-friendly mobile app, or implementing a comprehensive digital marketing strategy, our team is dedicated to delivering results that exceed expectations.
Website: www.technohacks.co.in
Industry: IT services & Corporate Training

### 1.2 Abstract
The ML-Based Carbon Emission Prediction System has been developed to overcome the limitations of traditional methods used for analyzing and predicting carbon emissions. This software is designed to provide an efficient and intelligent solution for studying emission patterns and supporting environmental decision-making. The system uses machine learning techniques to analyze historical carbon emission data and predict future emission levels accurately.
The application reduces manual effort and minimizes errors through proper data preprocessing and model-based prediction. It is user-friendly, reliable, and designed to generate accurate results using advanced algorithms such as Linear Regression and Random Forest Regression. The system provides better accuracy and efficiency compared to conventional statistical methods.
Every organization and industry faces challenges in monitoring factors such as energy consumption, industrial activity, transportation, and population growth, which directly impact carbon emissions. Therefore, this system is developed to help analyze these factors effectively and support strategic environmental planning. It enables users to understand emission trends, make informed decisions, and take proactive actions to reduce environmental impact.
This system is scalable, secure, and efficient, helping organizations, researchers, and policymakers utilize resources effectively while promoting sustainable development and better environmental management.

### 1.3 Problem Definition
The existing methods for carbon emission prediction heavily rely on manual calculations and statistical models. These approaches depend on fixed assumptions and formulas, which leads to low accuracy when dealing with complex and dynamic datasets. Furthermore, it is difficult to handle large volumes of real-time environmental data. The lack of automation and proper graphical visualization makes it challenging for policymakers and industries to interpret the data effectively and make timely decisions regarding emission control.

### 1.4 Existing System & Need for System
**Existing System**
* Traditional carbon emission prediction uses manual calculations and statistical models.
* These methods depend on fixed assumptions and formulas.
* Existing systems have low accuracy for complex and dynamic datasets.
* Difficult to handle large volumes of real-time data.
* Lack of automation and visualization.

**Need for the Proposed System**
* Increasing carbon emissions demand accurate prediction models.
* Machine Learning can handle large datasets and complex patterns.
* Automated prediction saves time and effort.
* Helps in early decision-making and environmental planning.
* Supports climate change control and sustainable development goals.

### 1.5 Scope of System
The scope of the ML-Based Carbon Emission Prediction System includes:
* Predicting future carbon emission levels.
* Analyzing emission trends using historical data.
* Supporting government and industrial decision-making.
* Providing graphical representation of emission patterns.
* Can be extended for real-time data integration.
* Suitable for smart cities, industries, and environmental agencies.

---

## Chapter 2: Proposed System

### 2.1 Feasibility Study
After analyzing all the existing or required functionalities of the system, the next task is the feasibility study. 

**A. Economical Feasibility:**
This is a very important aspect to be considered while developing a project.
* Uses free and open-source software (Python, Django).
* No licensing or subscription costs.
* Development and deployment costs are minimal.
* Suitable for academic and research purposes.

**B. Technical Feasibility:**
This included the study of function, performance and constraints that may affect the ability to achieve an acceptable system.
* The system uses Python, Machine Learning, and Django, which are widely used and well-supported technologies.
* Required libraries like Scikit-learn, Pandas, and NumPy are open-source.

**C. Operational Feasibility:**
No doubt the proposed system is fully GUI based that is very user friendly and all inputs to be taken all self-explanatory even to a layman.
* User-friendly web interface.
* Requires minimal training for users.
* Easy to maintain and update.
* Supports future enhancements.

### 2.2 Fact Finding Technique
Preliminary investigation implies the methods applied to collect information regarding carbon emission factors. We used following methods:
* **Observation:** Analyzing historical datasets, such as CSV/Excel records of energy consumption and industrial emissions. We observed the problems users and researchers face during environmental assessments.
* **Record Inspection:** Examining previous environmental reports and standard ML datasets to find the most impacting features on carbon emissions.
* **Interview:** We collected information from various industries to understand their specific problems in recording and maintaining emission logs.

### 2.3 Objective of System
The main objectives of the proposed system are:
* To predict future carbon emission levels using machine learning algorithms.
* To analyze historical emission data and identify trends.
* To improve prediction accuracy compared to traditional methods.
* To automate carbon emission analysis.
* To provide graphical visualization of emission data.
* To support decision-making for environmental planning.
* To contribute toward climate change mitigation.

### 2.4 User Requirement
**A. Hardware Requirements:**
* Processor: Intel Pentium(R) or equivalent
* RAM: 4GB or higher recommended
* Hard Disk: 500 GB

**B. Software Requirements:**
* Operating System: Windows 10 / 11
* Programming Language: Python
* Framework: Django (for web application)
* ML Libraries: Scikit-learn, Pandas, NumPy
* Frontend: HTML, CSS, JavaScript
* Database: SQLite / MySQL
* Browser Support: Google Chrome, Mozilla Firefox, Microsoft Edge.
* IDE/Tools: VS Code / PyCharm

**Functional Requirements:**
1. Allow users to access the web application.
2. Accept carbon emission related input data.
3. Preprocess input data (cleaning, normalization).
4. Train machine learning models using historical data.
5. Predict future carbon emission levels.

**Non-Functional Requirements:**
* Performance: System should provide predictions quickly.
* Accuracy: Prediction results should be reliable.
* Usability: User interface should be simple and user-friendly.
* Scalability: System should handle large datasets.
* Security: Data should be protected from unauthorized access.
* Reliability: System should work without frequent failures.
* Maintainability: Easy to update ML models and datasets.

---

## Chapter 3: System Analysis & Design

### 3.1 ER Diagram
*(Please attach the Entity-Relationship Diagram detailing the relationship between User, Emission Data, and Prediction entities)*

### 3.2 UML Diagrams
The system utilizes standard UML diagrams to represent system behavior and structure:
* **Class Diagram:** Shows classes like User, Dataset, ML_Model, and Prediction.
* **Object Diagram:** Represents instances of the classes during execution.
* **Use Case Diagram:** Defines interactions between Users (Admin/General User) and system features like "Upload Data", "Train Model", and "View Graph".
* **Sequence Diagram:** Details the flow of messages, e.g., User -> Server -> ML Model -> Output Prediction.
* **Activity Diagram:** Shows the step-by-step workflow from data loading to prediction visualization.
* **Component Diagram:** Illustrates the dependencies between Django backend, ML modules, and Database.
* **Deployment Diagram:** Shows how the application is deployed on a web server with an underlying SQLite/MySQL database.

*(Please attach the respective UML diagrams here)*

---

## Chapter 4: Database Design

**Table 1: User Table**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| user_id | Integer (PK) | Unique user ID |
| username | Varchar | User name |
| email | Varchar | User email |
| password | Varchar | Encrypted password |

**Table 2: Emission_Data Table**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| record_id | Integer (PK) | Record ID |
| year | Integer | Year |
| energy_consumption | Float | Energy used |
| transport_emission | Float | Transport CO₂ |
| industrial_emission | Float | Industrial CO₂ |
| total_emission | Float | Total CO₂ |

**Table 3: Prediction Table**
| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| prediction_id | Integer (PK) | Prediction ID |
| year | Integer | Predicted year |
| predicted_emission | Float | CO₂ value |
| model_used | Varchar | ML model name |

---

## Chapter 5: User Interface

### 5.1 Input / Output Screen
The web application provides the following functional screens for the users:
* **Login & Registration Page:** For secure user access.
* **Home Page:** Overview of the system and its capabilities.
* **Carbon Data / Train Page:** Interface to upload datasets and run model training.
* **Test Emission / Prediction Page:** Form to input specific environmental factors to get predicted CO₂ levels.
* **Graphs Page:** Visual representations (bar charts, line graphs) comparing actual vs predicted emissions.
* **Precautions Page:** Displays suggested steps to mitigate carbon footprint.
* **Database View:** Screen for admins to view stored emission records.
* **Carbon Chatbot:** Interactive assistant to answer emission-related FAQs.

*(Please attach screenshots of the respective pages here)*

### 5.2 Report
* **Prediction Reports:** The system can generate reports containing 5+ predicted records for future years, displaying tabular and graphical forms of expected carbon emission trends.
*(Please attach report screenshot here)*

---

## Chapter 6: Testing

### 6.1 Test Strategy
* **Manual Testing** is used for UI validation.
* **Unit Testing** for individual modules (data processing, ML training).
* **Integration Testing** for combined modules (Django frontend with ML backend).
* **Acceptance Testing** for user satisfaction and accuracy verification.

### 6.2 Unit Test Plan
| Module | Test Description | Expected Result |
| :--- | :--- | :--- |
| Data Loading | Load CSV dataset | Dataset loaded successfully |
| Preprocessing | Handle missing values | No null values |
| ML Model | Train model | Model trained |
| Prediction | Generate output | Accurate prediction |

### 6.3 Acceptance Test Plan
| Feature | Input | Expected Output |
| :--- | :--- | :--- |
| Emission Prediction | Valid emission values | Correct CO₂ prediction |
| Graph Display | Historical data | Proper graph shown |
| Report Generation | 5+ records | Report generated |

### 6.4 Defect Report / Test Log
| Defect ID | Description | Status |
| :--- | :--- | :--- |
| D01 | Invalid input crash | Fixed |
| D02 | Graph loading delay | Fixed |
| D03 | Data format issue | Fixed |

---

## Chapter 7: Advantages, Limitations and Proposed enhancement

### Advantages
* **Automated & Fast:** Saves significant time compared to manual environmental analysis.
* **High Accuracy:** Leverages machine learning for discovering complex patterns in emission datasets.
* **Data Visualization:** Users can easily compare trends through graphs and charts, aiding quick decision-making.
* **Strategic Planning:** Helps government and industrial authorities formulate better environmental policies to achieve sustainable development goals.

### Limitations
1. **Dependence on Historical Data Accuracy:** The prediction results are highly dependent on the quality of historical data. Incorrect or biased information affects the outcome.
2. **Limited Real-Time Data Support:** It does not continuously collect real-time data from live sources, which may reduce prediction accuracy for rapidly changing conditions.
3. **Variation in Accuracy with Dataset Size:** Smaller datasets may not capture all patterns, leading to less reliable predictions.
4. **Inability to Predict Sudden Changes:** Natural disasters, pandemics, or policy changes cannot be predicted as they aren't in historical data.
5. **Requirement of Periodic Retraining:** The ML model needs to be retrained regularly with updated data.
6. **Limited Feature Coverage:** May not include all influencing factors like economic changes or technological advancements.

### Proposed Enhancements
1. **Real-Time Data Integration Using APIs:** Fetching real-time emission data from government agencies to improve accuracy.
2. **Use of Deep Learning Models (LSTM):** Long Short-Term Memory networks can be used to capture long-term temporal patterns in time-series data.
3. **Cloud Deployment:** Deploying the system on AWS, Azure, or Google Cloud for better scalability and availability.
4. **Mobile Application Support:** A mobile app to allow users to access predictions anytime.
5. **Integration with IoT Sensors:** Collecting real-time data directly from industrial zones and power plants.
6. **Multi-Country Emission Comparison:** Adding multi-country datasets for global environmental studies.
7. **Policy Impact Analysis Module:** To analyze the impact of environmental policies on emission levels.

---

## Chapter 8: Conclusion

The ML-Based Carbon Emission Prediction System effectively predicts future carbon emission levels by analyzing historical data using machine learning techniques. The system addresses the limitations of traditional manual and statistical methods by offering improved accuracy, automation, and scalability. 

By providing clear predictions and graphical visualizations, the system assists governments, industries, environmental agencies, and researchers in understanding emission trends and planning effective mitigation strategies. Although the system has certain limitations, proposed enhancements such as real-time data integration, deep learning models, and cloud deployment can significantly improve its performance.

Overall, the system contributes toward sustainable development, environmental protection, and climate change mitigation, making it a valuable tool for future environmental planning and decision-making.

---

## Chapter 9: Bibliography

**A. Reference Books:**
* *Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow* – Aurélien Géron
* *Django for Beginners: Build websites with Python and Django* – William S. Vincent
* *Python Data Science Handbook* – Jake VanderPlas
* *Software Engineering with UML* – Mohammad Ali Shaikh
* *HTML & CSS: Design and Build Web Sites* – Jon Duckett

**B. Reference Websites:**
* https://www.python.org/
* https://docs.djangoproject.com/
* https://scikit-learn.org/
* https://stackoverflow.com/
* https://www.geeksforgeeks.org/
* https://www.tutorialspoint.com/
