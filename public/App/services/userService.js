angular.module('BITSAAB').factory('userService',function($rootScope,$http,$q,$log,localStorageService){

  var user={};
  return {
    getUser:function(){
      return user;
    },
    setUser:function(new_user){
      user=new_user;
      localStorageService.set('user', user);
    },
    userExists:function(obj){
      return $http({
        method:'GET',
        url:'/checkUser',
        params:obj
      }).then(function(data){
        console.log(data.data);
        if(data.data){
          return data.data;
        }else{
          return $q.reject(null)
        }

      },function(data){
        return $q.reject(data.data);
      });
    },
    registerUser:function(new_user,avatar){
        return $http({
            method:'POST',
            url:'/addUser',
            headers:{'Content-Type':undefined},
            transformRequest:function(data){
              var formData=new FormData();
                data.user.avatar_url=data.user.username+data.files.name.slice(data.files.name.lastIndexOf("."));
                formData.append('user',angular.toJson(data.user));
                formData.append('file',data.files);
                $log.debug(formData);
                $log.debug(data);
                return formData;
            },
            data:{user:new_user,files:avatar}
        }).then(function(data){
            console.log(data.data);
            //user=data.data;
            return data.data;
        },function(data){
            //return data.data;
            $q.reject({status:data.data.status,info:"User already registered!"});
            //console.log(data.data);
        });
    },
    activateAccount:function(activationObj){
      return $http({
        method:'POST',
        url:'/user/activateAccount/'+activationObj.token,
        data:activationObj
      }).then(function(data){
        if(data.data && data.data.status && data.data.username){
          user=data.data;
          $log.info(user);
          return user;
        }else if(data.data && data.data.status){
          $log.warn(data.data);
          return {status:true,info:'Account activated, You can login now!'};
        }else{
          $log.warn(data.data);
          return {status:false,info:data.data.info};
        }
      },function(data){
        $log.warn(data.data);
        return {status:false};
      });
    },
    login:function(new_user){
      return $http({
        method:'POST',
        url:'/login',
        data:new_user
      }).then(function(data){
        console.log(data.data);
        if(data.data.username){
          user=data.data;
          localStorageService.set('user', user);
          return user;
        }else{
          return data.data;
        }
      },function(data){
        console.log(data.data);
        return data.data;
      });
  },
  logout:function(){
    user={};
    return localStorageService.remove('user');
  },
    getLoggedInUser:function(){
      $rootScope.showLoader=true;
        return $http({
          method:'POST',
          url:'/getLoggedInUser',
          data:{token:user.token,username:user.username}
        }).then(function(data){
          $rootScope.showLoader=false;
          user=data.data;
          return user;
        },function(data){
          $rootScope.showLoader=false;
          $q.reject();
        });
    },
    sendResetLink:function(model){
        return $http({
            method:'POST',
            url:'/sendResetLink',
            data:model
        }).then(function(data){
            $log.info(data.data);
            return data.data;
        },function(data){
            $log.warn(data.data);
            return data.data;
        });
    },
    resetPassword:function(model){
        return $http({
            method:'POST',
            url:'/resetPassword',
            data:model
        }).then(function(data){
            $log.info(data.data);
            return data.data;
        },function(data){
            $log.warn(data.data);
            return data.data;
        });
    },
    updateLoginInfo:function(model){
      return $http({
        method:'POST',
        url:'/user/updateUsernameOrPrimaryEmail',
        data:model
      }).then(function(data){
        $log.info(data.data);
        return data.data;
      },function(data){
        $log.warn(data.data);
        return data.data;
      });
    },
    updateUserInfo:function(new_info){
      return $http({
        method:'POST',
        url:'user/update',
        data:new_info
      }).then(function(data){
        if(data.data.status){
          $log.info(data.data);
          user=data.data;
          return data.data;
        }else{
          $log.warn(data.data)
          return data.data;
        }
      },function(data){
        $log.warn(data.data)
          return data.data;
      });
    },
    changePassword:function(obj){
      return $http({
        method:'POST',
        url:'user/updatePassword',
        data:obj
      }).then(function(data){
        if(data.data.status){
          $log.info(data.data);
          return data.data;
        }else{
          $log.warn(data.data)
          return data.data;
        }
      },function(data){
        $log.warn(data.data)
          return data.data;
      });
    },
    getUsers:function(obj){
      obj.token=user.token;
      return $http({
        method:'POST',
        url:'/users',
        data:obj
      }).then(function(data){
        if(data.data.status){
          $log.info(data.data);
          return data.data;
        }else{
          $log.warn(data.data)
          return data.data;
        }
      },function(data){
        $log.warn(data.data)
          return data.data;
      });
    },
    fetchUser:function(model){
      model.token=user.token;
      return $http({
        method:'POST',
        url:'/user',
        data:model
      }).then(function(data){
        if(data.data.status){
          $log.info(data.data);
          return data.data;
        }else{
          $log.warn(data.data)
          return data.data;
        }
      },function(data){
        $log.warn(data.data)
          return data.data;
      });
    }
  };

});
