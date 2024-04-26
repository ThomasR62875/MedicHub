/*
<View style={styles.verticallySpaced}>
                <Button
                    title={loading ? 'Cargando ...' : 'Actualizar'}
                    onPress={() => updateProfile({ first_name,   last_name,  dni,  email,  avatar_url })}
                    disabled={loading}
                />
            </View>


            <Input label="Avatar" value={avatar_url} onChangeText={(text) => setAvatarUrl(text)} />
                </View>
                <View style={styles.col}>
                    <View>
                        <Input label="Nombre" value = {first_name} onChangeText={(text) => setFirstName(text)} />
                    </View>
                    <View>
                        <Input label="Apellido" value={last_name} onChangeText={(text) => setLastName(text)} />
                    </View>
                </View>
            </View>
            <View>
                <Input label="DNI" value={dni ? dni.toString() : ''}
                       onChangeText={(text) => {
                           const parsedDNI = parseInt(text, 10);
                           if (!isNaN(parsedDNI)) {
                               setDni(parsedDNI);
                           }
                       }}
                       keyboardType="numeric"/>
                <Input label="Mail" value={email} onChangeText={(text) => setEmail(text)} />

                <View >
                    <Button title="Cancelar" onPress={() => flag=false}/>
                    <Button title="Guardar" onPress={() => updateProfile({ first_name,   last_name,  dni,  email,  avatar_url })}/>
                </View>
 */