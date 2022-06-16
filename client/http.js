/**
 * EasyHTTP Library
 * Library to make HTTP requesting easy
 *
 * @version 3.0.0
 * @author Kristof Barnabas Siket
 * @license MIT
 *
 **/

class EasyHTTP {
  /**
   * Make an HTTP GET request.
   */
  async get(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }

  /**
   * Make an HTTP POST request.
   */
  async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const resData = await response.json();
    return resData;
  }

  /**
   * Make an HTTP PUT request.
   */
  async put(url, data) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const resData = await response.json();
    return resData;
  }

  /**
   * Make an HTTP DELETE request.
   */
  async delete(url) {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const resData = await "Resource Deleted...";
    return resData;
  }
}

export const http = new EasyHTTP();
