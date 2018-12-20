package auth

import (
    "encoding/json"
    "errors"
    "net/http"
    "fmt"

    "github.com/gin-gonic/gin"
    jm "github.com/auth0/go-jwt-middleware" //json web token middleware for Auth0
    j "github.com/dgrijalva/jwt-go" //a json web token package
)

//Json web key struct
type Jwk struct {
    Alg string `json:"alg"`
    Kty string `json:"kty"`
    Use string `json:"use"`
    X5c []string `json:"x5c"`
    N string `json:"n"`
    E string `json:"e"`
    Kid string `json:"kid"`
    X5t string `json:"x5t"`
}

//object of an array of json web keys, as the request to Auth0 server sends back an object with an array
type Jwks struct {
    Keys []Jwk `json:"keys"`
}

var jwtMW *jm.JWTMiddleware

func WebTokenMW(){
    jwtMW = jm.New(jm.Options{
        ValidationKeyGetter: func(token *j.Token) (interface{}, error) {
            audience := "golang-gin"
            checkaud := token.Claims.(j.MapClaims).VerifyAudience(audience, false) //check audience of the json web token
            if !checkaud {
                return token, errors.New("Audience is invalid")
            }
            issuer := "https://tennant.auth0.com/"
            checkiss := token.Claims.(j.MapClaims).VerifyIssuer(issuer, false) //check issuer of the json web token
            if !checkiss {
                return token, errors.New("Issuer is invalid")
            }

            certificate, err := getCertificate(token) //get certificate from Auth0 server
            if err != nil {
                fmt.Println("Unable to get certificate: ", err)
            }

            result, err2 := j.ParseRSAPublicKeyFromPEM([]byte(certificate)) //Verify the signature on the json web token
            if err2 != nil {
                fmt.Println("Unable to verify signature: ", err2)
            }
            return result, err
        },
        SigningMethod: j.SigningMethodRS256, //RS256 signing method
    })
}

func getCertificate(token *j.Token) (string, error) {
    certificate := ""
    response, err := http.Get("https://tennant.auth0.com/.well-known/jwks.json") //get the json web keys from Auth0 server
    if err != nil {
        return certificate, err
    }
    defer response.Body.Close()

    var jwks = Jwks{}
    err = json.NewDecoder(response.Body).Decode(&jwks)  //Decode the response body
    if err != nil {
        return certificate, err
    }

    //construct the certificate
    v := jwks.Keys[0].X5c[0]
    if token.Header["kid"] == jwks.Keys[0].Kid {
        certificate = "-----BEGIN CERTIFICATE-----\n" + v + "\n-----END CERTIFICATE-----"
    }
    if certificate == "" {
        return certificate, errors.New("unable to find appropriate key.")
    }

    return certificate, nil
}

//authentication middleware that is run for any request to the backend
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        err := jwtMW.CheckJWT(c.Writer, c.Request)
        if err != nil {
            c.AbortWithStatus(401)
            fmt.Println(err)
        }
     }
}
