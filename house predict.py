
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

data=pd.read_csv('house_price.csv')
x=data['size'].values
y=data['price'].values

m=len(y)    # number of training examples



#normalization
#Feature normalization is the process of scaling input features so Sthat they have a mean of zero and a standard deviation of one, which helps gradient descent converge faster.
X_mean = np.mean(x)
X_std = np.std(x)

X = (x - X_mean) / X_std

X = np.c_[np.ones(m), X]

theta = np.zeros(2)
alpha = 0.1       # learning rate
iterations = 100


def compute_cost(X, y, theta):
    m = len(y)
    predictions = X @ theta
    error = predictions - y
    cost = (1 / (2 * m)) * np.sum(error ** 2)
    return cost

def gradient_descent(X, y, theta, alpha, iterations):
    m = len(y)
    cost_history = []

    for _ in range(iterations):
        predictions = X @ theta
        error = predictions - y

        gradient = (1 / m) * (X.T @ error)
        theta = theta - alpha * gradient

        cost_history.append(compute_cost(X, y, theta))

    return theta, cost_history


theta, cost_history = gradient_descent(X, y, theta, alpha, iterations)

print("Final Parameters (theta):", theta)


plt.plot(cost_history)
plt.xlabel("Iterations")
plt.ylabel("Cost J(theta)")
plt.title("Cost Function Convergence")
plt.show()

def predict(size):
    size_norm = (size - X_mean) / X_std
    x_input = np.array([1, size_norm])
    return x_input @ theta

predicted_price = predict(1600)
print("Predicted Price:", int(predicted_price))
