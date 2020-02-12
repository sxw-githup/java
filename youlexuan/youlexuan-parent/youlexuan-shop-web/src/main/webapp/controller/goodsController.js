 //控制层 
app.controller('goodsController' ,function($scope,$controller ,itemCatService,typeTemplateService ,goodsService,fileUpload){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

	// 查询分类
	// 获取一级分类
	$scope.selectItemCatOneList = function () {
			itemCatService.findItemCatByPid(0).success(
				function (response) {
					$scope.itemCatOneList = response;
                }
			)
    }
    // 获取二级分类
	$scope.$watch('entity.tbGoods.category1Id',function (oldValue,newValue) {
		if(oldValue){
			// 如果一级分类选中了结果，开始查询二级分类
            itemCatService.findItemCatByPid(oldValue).success(
            	function (response) {
                    $scope.itemCatTwoList = response;
                }
			)
		}
    },true);
    // 获取三级分类
	$scope.$watch('entity.tbGoods.category2Id',function (oldValue,newValue) {

		if(oldValue){
			// 如果一级分类选中了结果，开始查询二级分类
            itemCatService.findItemCatByPid(oldValue).success(
            	function (response) {
                    $scope.itemCatThreeList = response;
                }
			)
		}
    })
    // 获取模板的id
	$scope.$watch('entity.tbGoods.category3Id',function (oldValue,newValue) {
		if(oldValue){
			// 在查询模板的时候已经是最后一级，没有父id了，直接通过id查询结果
            itemCatService.findOne(oldValue).success(
            	function (response) {
                    $scope.entity.tbGoods.typeTemplateId = response.typeId;
                }
			)
		}
    });
	// 查询品牌
    $scope.$watch('entity.tbGoods.typeTemplateId',function (oldValue,newValue) {
        if(oldValue){
            // 在查询模板的时候已经是最后一级，没有父id了，直接通过id查询结果
            typeTemplateService.findOne(oldValue).success(
                function (response) {
                	// 模板id查询品牌
                   $scope.brandList = JSON.parse(response.brandIds)
					// 根据模板id查询扩展属性
					$scope.entity.tbGoodsDesc.customAttributeItems = JSON.parse(response.customAttributeItems);

                }
            );
            // 查询规格列表
			typeTemplateService.selectSpecList(oldValue).success(
					function (response) {
						$scope.specList = response;
                    }
				)
       		 }
    });






    // 图片上传
	$scope.fileUpload = function () {
		fileUpload.fileUpload().success(
			function (response) {
				if(response.success){
                    $scope.entity_image.url = response.msg;
                }else{
					alert(response.msg);
				}
            }
		)
    }
    //  图片列表
	$scope.entity = {tbGoodsDesc:{itemImages:[]}}
	// 保存图片到集合
	$scope.addImage = function () {
		$scope.entity.tbGoodsDesc.itemImages.push($scope.entity_image);
		console.log($scope.entity.tbGoodsDesc.itemImages)
    }
    // 从集合中移除图片
    $scope.deleteImage = function (index) {
        $scope.entity.tbGoodsDesc.itemImages.splice(index,1);
    }
});	
























