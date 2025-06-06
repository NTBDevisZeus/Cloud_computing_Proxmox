from rest_framework import serializers

from CloudAPI.models import User, VirtualMachine


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username','password', 'wallet']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
    def create(self, validated_data):
        data = validated_data.copy()
        user = User(**data)
        user.set_password(data['password'])
        user.save()
        return user


class VirtualMachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualMachine
        fields = ['name', 'id' ,'status', 'date_release', 'date_end', 'unit_price']

    def get_user(self, obj):
        return obj.user.id