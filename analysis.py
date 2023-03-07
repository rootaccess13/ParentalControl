import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder
import pickle
# Load the csv file into a pandas DataFrame
df = pd.read_csv("predict_2.csv")

# Split the data into features (X) and target (y)
X = df[['url', 'phish_detail_url', 'submission_time', 'verified', 'verification_time', 'online']]
y = df['is_secure']

# One-hot encode the categorical features (url and phish_detail_url)
encoder = OneHotEncoder(handle_unknown='ignore')
X_encoded = encoder.fit_transform(X[['url', 'phish_detail_url']])

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=0)

# Train a Logistic Regression model on the training data
clf = LogisticRegression()
clf.fit(X_train, y_train)

# Make predictions on the test data
y_pred = clf.predict(X_test)

# Evaluate the accuracy of the model
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)

with open('model.pkl', 'wb') as file:
    pickle.dump(clf, file)